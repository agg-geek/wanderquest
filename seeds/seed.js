const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'))
	.catch(() => console.log('Connection to database failed'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'));

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data successfully deleted');
	} catch (err) {
		console.log(err);
	}
};

const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users);
		await Review.create(reviews);
		console.log('Data successfully saved');
	} catch (err) {
		console.log(err);
	}
};

async function seed() {
	await deleteData();
	await importData();
	process.exit();
}

seed();
