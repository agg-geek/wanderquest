const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Tour = require('./models/tourModel');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'))
	.catch(() => console.log('Connection to database failed'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-files/data/tours-simple.json`, 'utf-8'));

const deleteTours = async () => {
	try {
		await Tour.deleteMany();
		console.log('Tours successfully deleted');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const importTours = async () => {
	try {
		await Tour.create(tours);
		console.log('Tours successfully saved');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

// console.log(process.argv);

if (process.argv[2] === '--importT') importTours();
else if (process.argv[2] === '--deleteT') deleteTours();
