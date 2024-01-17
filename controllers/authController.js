const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.signup = catchAsync(async (req, res, next) => {
	// using the complete req.body has a serious security flaw
	// like a user may state his role: 'admin' (which we will define in the model later)
	// and thus become a user
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	res.status(201).json({
		status: 'success',
		data: { user: newUser },
	});
});
