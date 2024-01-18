const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		status: 'success',
		results: users.length,
		data: { users },
	});
});

module.exports.getUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};

module.exports.createUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};

module.exports.updateDetails = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm)
		return next(new AppError('This route is not for updating password', 400));

	const details = {
		...(req.body.name && { name: req.body.name }),
		...(req.body.email && { email: req.body.email }),
	};
	const updatedUser = await User.findByIdAndUpdate(req.user.id, details, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: { user: updatedUser },
	});
});

module.exports.updateUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};

module.exports.deleteAccount = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { isActive: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

module.exports.deleteUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};
