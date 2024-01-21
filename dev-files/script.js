const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

const User = require('./../models/userModel');

mongoose
	.connect(process.env.DATABASE_URL)
	.then(() => console.log('Successfully connected to the database!'))
	.catch(() => console.log('Connection to database failed'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));

const cnt = {
	admin: 1,
	lead: 1,
	guide: 1,
	user: 1,
};

const users2 = users.map(user => {
	const newUser = {
		_id: user._id,
		name: user.name,
		email: `${user.role}${cnt[user.role]}@e.com`,
		role: user.role,
		active: true,
		photo: user.photo,
		password: '12345678',
		passwordConfirm: '12345678',
	};
	cnt[user.role]++;
	return newUser;
});

fs.writeFileSync(`${__dirname}/data/users2.json`, '');
fs.writeFileSync(`${__dirname}/data/users2.json`, JSON.stringify(users2));
process.exit();
