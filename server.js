const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'));
// .catch(() => console.log('Connection to database failed'));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

process.on('unhandledRejection', err => {
	console.log(err.name); // MongoServerError
	console.log(err.message); // bad auth
	console.log('Unhandled promise rejection, shutting down');
	// process.exit exists the app abruptly, all ongoing requests are just stopped
	// we stop more gracefully by closing the server which finishes ongoing requests first
	// and after this, the callback runs and we shut the app
	server.close(() => {
		process.exit(1);
	});
});
