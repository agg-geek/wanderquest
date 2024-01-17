const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// handling promise rejection is only for asynchronous code (as promise)
// we handle sync code errors using uncaught exceptions
// exception may be caused by say, logging x where x is undefined (see below)
// also, add this listener at the top otherwise you will not catch errors
// (define clg(x) before this and check!)
// make sure to keep this before you require app atleast
process.on('uncaughtException', err => {
	console.log('Uncaught exception, shutting down');
	console.log(err.name);
	console.log(err.message);
	// no need of server.close() as this is for sync code, so no requests
	process.exit(1);
});

// causes reference error, x is not defined
// console.log(x);

const app = require('./app');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'));
// .catch(() => console.log('Connection to database failed'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

// this is only for asynchronous code (as unhandled promise rejections)
process.on('unhandledRejection', err => {
	console.log('Unhandled promise rejection, shutting down');
	console.log(err.name); // MongoServerError
	console.log(err.message); // bad auth
	server.close(() => {
		process.exit(1);
	});
});
