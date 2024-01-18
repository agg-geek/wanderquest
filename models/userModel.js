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
	isActive: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// we don't show the users who have deleted their accounts
// that is, isActive: false
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
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
