const multer = require('multer');
const sharp = require('sharp');

const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Only image uploads are allowed', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

module.exports.getAllUsers = factory.getAll(User);
module.exports.getUser = factory.getOne(User);
module.exports.updateUser = factory.updateOne(User);
module.exports.deleteUser = factory.deleteOne(User);

module.exports.createUser = (req, res, next) => {
	res.status(500).json({
		status: 'error',
		message: 'Use /signup instead of this route',
	});
};

module.exports.getUserDetails = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

module.exports.uploadUserPhoto = upload.single('photo');

module.exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`);

	next();
});

module.exports.updateDetails = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm)
		return next(new AppError('This route is not for updating password', 400));

	const details = {
		...(req.body.name && { name: req.body.name }),
		...(req.body.email && { email: req.body.email }),
		...(req.file && { photo: req.file.filename }),
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

module.exports.deleteAccount = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { isActive: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
