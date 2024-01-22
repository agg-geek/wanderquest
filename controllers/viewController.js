const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getAllTours = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).render('tours/index', {
		title: 'All tours',
		tours,
	});
});

module.exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate('reviews');

	// res.status(200).json({ tour });
	res.status(200).render('tours/show', {
		title: tour.name,
		tour,
	});
});
