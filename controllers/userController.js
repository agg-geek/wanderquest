const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
