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

	// we encrypt the resetToken before storing it in db
	// reset tokens don't need a very cryptographically secure encryption
	// as they are less dangerous, so just use crypto package to encrypt it
	// prettier-ignore
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	console.log({ resetToken }, this.passwordResetToken);

	// expires in 10 mins
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	// return un-encrypted reset token to user
	// we have stored the encrypted version in db
	return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
