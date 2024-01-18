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

const sendToken = (res, statusCode, userId, userData) => {
	const token = signToken(userId);
	const cookieOptions = {
		// prettier-ignore
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000),
		httpOnly: true,
		...(process.env.NODE_ENV === 'production' && { secure: true }),
	};
	res.cookie('jwt', token, cookieOptions);

	res.status(statusCode).json({
		status: 'success',
		token,
		...(userData && { data: userData }),
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

	const userData = { name: newUser.name, email: newUser.email };
	sendToken(res, 201, newUser._id, { user: userData });
});

module.exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(new AppError('Email or password is missing', 400));

	const user = await User.findOne({ email }).select('+password');
	const correctPwd = await user?.checkPassword(user.password, password);

	if (!user || !correctPwd)
		return next(new AppError('Incorrect email or password', 401));

	sendToken(res, 200, user._id);
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

exports.resetPassword = catchAsync(async (req, res, next) => {
	// prettier-ignore
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) return next(new AppError('Token is invalid or expired', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	sendToken(res, 200, user._id);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	const { currentPwd, newPwd, newPwdConfirm } = req.body;
	if (!currentPwd || !newPwd || !newPwdConfirm)
		return next(new AppError('A required password is missing', 400));

	const user = await User.findById(req.user.id).select('+password');

	const correctPwd = await user.checkPassword(user.password, currentPwd);
	if (!correctPwd) return next(new AppError('Current password is incorrect', 401));

	user.password = newPwd;
	user.passwordConfirm = newPwdConfirm;
	await user.save();

	sendToken(res, 200, user._id);
});
