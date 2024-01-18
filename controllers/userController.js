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

// a logged in user can update his name and email
// password update is not allowed
// this route is intended for the user himself and not the admin
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

	// we are sending the whole updatedUser,
	// and data sent also includes properties like passwordChangedAt, __v etc
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

module.exports.deleteUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};
