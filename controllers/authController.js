const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	// since we are signing up the user, we should also log him in
	// so by sending the token, we also log in the user
	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_TIME,
	});

	res.status(201).json({
		status: 'success',
		data: { user: newUser },
		token,
	});
});
