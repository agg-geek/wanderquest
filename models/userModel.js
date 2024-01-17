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
		select: false,
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
	// this field will be implemented in the future
	// for now, just edit a  user and mention this field
	// in date format '2024-08-30' for testing
	// mongodb will appropriately parse this as an ISOString
	passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.checkPassword = async (userPwd, enteredPwd) => {
	return await bcrypt.compare(enteredPwd, userPwd);
};

// returns true if password was changed after entered timestamp
// notice this is an instance method so this refers to document (user)
userSchema.methods.checkPasswordChange = function (jwtTimestamp) {
	// users who never changed their password will have this
	// passwordChangedAt undefined, so handle them
	if (!this.passwordChangedAt) return false;

	// passwordChangedAt is an isostring
	// getTime will convert isostring to time in milliseconds
	// jwt timestamp is in ms, so divide by 1000
	const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
	return jwtTimestamp < changedTimestamp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
