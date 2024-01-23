const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

module.exports.addUserLocal = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) return next();
		const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const currentUser = await User.findById(payload.id);
		if (!currentUser) return next();
		if (currentUser.checkPasswordChange(payload.iat)) return next();

		res.locals.user = currentUser;
		next();
	} catch (err) {
		console.log(err);

		next();
	}
};

module.exports.renderAllTours = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).render('tours/index', {
		title: 'All tours',
		tours,
	});
});

module.exports.renderTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate('reviews');
	if (!tour) return next(new AppError('Tour not found', 404));

	res.status(200).render('tours/show', {
		title: tour.name,
		tour,
		mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
	});
});

module.exports.renderLoginForm = (req, res) => {
	res.status(200).render('users/login', { title: 'Login' });
};

module.exports.renderAccountPage = (req, res) => {
	res.status(200).render('users/account', { title: 'My account' });
};
