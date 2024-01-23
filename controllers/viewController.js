const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

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

// to update name, email of the user, you use the form element itself
// to send the POST request which is handled by this controller
// however, this approach has drawback like, you need to create
// a different route instead of using the route from the API
// another drawback is that if you enter invalid email,
// then you can just render error page instead of alerting the error
// (as alerts is ES6 modules and this module is CommonJS)
module.exports.updateUserDetails = catchAsync(async (req, res, next) => {
	const details = {
		...(req.body.name && { name: req.body.name }),
		...(req.body.email && { email: req.body.email }),
	};

	try {
		const updatedUser = await User.findByIdAndUpdate(req.user.id, details, {
			new: true,
			runValidators: true,
		});

		res.status(200).redirect('/tours');
	} catch (err) {
		res.status(500).render('error', {
			title: 'Error',
			errmsg: 'An error occurred while updating the data',
		});
	}
});
