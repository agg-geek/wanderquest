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

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE_TIME,
	});

	// don't send the password when user is created
	// passwordConfirm is also a field but that is undefined
	// so it isn't getting send in res,
	// though you can choose to remove it yourself
	const { password, ...userData } = newUser._doc;

	res.status(201).json({
		status: 'success',
		data: { user: userData },
		token,
	});
});
