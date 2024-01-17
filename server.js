const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'));
// .catch(() => console.log('Connection to database failed'));
// if this catch block is removed and the mongodb password in config.env is incorrect,
// we get auth error which is an unhandled promise rejection (as catch block is removed)
// this error is not an express error, and such promise rejections can happen anywhere
// here, we can fix it by just adding the catch block
// however, we handle promise rejections globally

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

// whenever there is unhandled promise rejection anywhere in our app,
// process will emit an event called unhandled rejection and we can subscribe to that event

process.on('unhandledRejection', err => {
	console.log(err.name); // MongoServerError
	console.log(err.message); // bad auth
	console.log('Unhandled promise rejection, shutting down');

	// we can just shutdown the app in this case, using process.exit()
	process.exit(1);
});
