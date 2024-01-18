const crypto = require('crypto');
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
	passwordResetToken: String,
	passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

// used to update the passwordChangedAt property when password is changed
userSchema.pre('save', function (next) {
	// when we are creating a new user, then password has not been modified
	// so we don't need to set the passwordChangedAt property
	// hence use this.isNew, this.isNew is a property on the document itself
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now();
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

userSchema.methods.createPasswordResetToken = function (jwtTimestamp) {
	const resetToken = crypto.randomBytes(32).toString('hex');
	// prettier-ignore
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
