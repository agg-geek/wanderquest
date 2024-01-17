const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
	// 1. Get token, if not present, return
	let token;
	if (req.headers.authorization?.startsWith('Bearer'))
		token = req.headers.authorization.split(' ')[1];

	if (!token) return next(new AppError('Please login to view', 401));

	// ===============================

	// 2. Handle invalid and expired token

	// jwt verify is an async fn which takes a 3rd param as the callback fn
	// which will run once the token has been verified
	// since we want to keep using async await and not callbacks, we promisify the fn
	// using the builin util package method promisify
	const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// console.log(payload); // { id: '65a789edb2c605a57f59f004', iat: 1705490960, exp: 1708082960
	// iat: creation data, exp: expiration date, automatically set by jwt

	// change the payload in the token a bit using jwt debugger,
	// jwt throws a jsonWebTokenError: invalid signature
	// which we handle in the errorController
	// also, use a expired token (set expiresIn in config.env to 5000)
	// token expired error is also handled in errorController
	// thus, we raise relevant errors and handle invalid and expired tokens

	// ===============================

	// 3. Check if user still exists
	// 4. Check if user changed pwd after the token was issued

	next();
});
