const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: 8,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			validator: function (pwdConfirm) {
				return pwdConfirm === this.password;
			},
			message: 'Confirm password does not match password',
		},
	},
});

userSchema.pre('save', async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	// pwdConfirm is only to make sure user enters the correct pwd
	// once the pwds have been validated to be same,
	// then we no longer need to store pwdConfirm's value in db
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
