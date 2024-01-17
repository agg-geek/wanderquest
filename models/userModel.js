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
	role: {
		type: String,
		enum: ['user', 'guide', 'lead', 'admin'],
		default: 'user',
	},
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

userSchema.methods.checkPasswordChange = function (jwtTimestamp) {
	if (!this.passwordChangedAt) return false;

	const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
	return jwtTimestamp < changedTimestamp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
