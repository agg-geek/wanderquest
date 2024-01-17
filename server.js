const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
	console.log('Uncaught exception, shutting down');
	console.log(err.name);
	console.log(err.message);
	process.exit(1);
});

const app = require('./app');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'))
	.catch(() => console.log('Connection to database failed'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

process.on('unhandledRejection', err => {
	console.log('Unhandled promise rejection, shutting down');
	console.log(err.name);
	console.log(err.message);
	server.close(() => {
		process.exit(1);
	});
});
