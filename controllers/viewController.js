const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).render('tours/index', {
		title: 'All tours',
		tours,
	});
});
