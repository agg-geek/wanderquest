const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/sendEmail');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_TIME,
	});
};

module.exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
	});

	const token = signToken(newUser._id);

	const { password, ...userData } = newUser._doc;

	res.status(201).json({
		status: 'success',
		data: { user: userData },
		token,
	});
});

module.exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Email or password is missing', 400));
	}

	const user = await User.findOne({ email }).select('+password');
	const correctPwd = await user?.checkPassword(user.password, password);

	if (!user || !correctPwd) {
		return next(new AppError('Incorrect email or password', 401));
	}

	const token = signToken(user._id);

	res.json({
		status: 'success',
		token,
	});
});

module.exports.isLoggedIn = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization?.startsWith('Bearer'))
		token = req.headers.authorization.split(' ')[1];

	if (!token) return next(new AppError('Please login to view', 401));

	const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(payload.id);
	if (!currentUser)
		return next(new AppError('User with this token does not exist', 401));

	if (currentUser.checkPasswordChange(payload.iat))
		// prettier-ignore
		return next(new AppError('Password was changed recently. Please login again.', 401));

	req.user = currentUser;
	next();
});

module.exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new AppError('You are not authorized!', 403));

		next();
	};
};

// FORGOT PASSWORD FUNCTIONALITY
// 1. user sends a post request to forgotPassword route containing his email,
// and gets a token (not jwt)

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) return next(new AppError('User does not exist', 404));

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/reset-password/${resetToken}`;

	const message = `To reset your password, send a PATCH request to:
        ${resetURL}
        containing your new password and passwordConfirm.
        If you didn't forget your password, please ignore this email.`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppError('There was an error sending the email'), 500);
	}
});

// 2. user sends the token along with new password and passwordConfirm to update passsword
exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	// we had sent the user unencrypted token and we stored the encrypted token in db
	// so since we get the unencrypted token from user,
	// we first encrypt it and compare it with that in db
	// notice that we get the token from the param
	// prettier-ignore
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	// notice that we already checked for expired token above using $gt: Date.now()
	// so now just check for no user
	if (!user) return next(new AppError('Token is invalid or expired', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	// we now run save and not findOneAndUpdate because we need to run all the validators
	// and the save middleware fns
	// when you don't need to run the validators, you still need the save fn
	// as you need to run the middleware
	await user.save(); // notice we don't have the validateBeforeSave: false anymore

	// 3) Update changedPasswordAt property for the user

	// 4) Log the user in, send JWT
	const token = signToken(user._id);

	res.json({
		status: 'success',
		token,
	});
});
