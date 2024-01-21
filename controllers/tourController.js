const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

module.exports.getAllTours = factory.getAll(Tour);
module.exports.getTour = factory.getOne(Tour, { path: 'reviews' });
module.exports.createTour = factory.createOne(Tour);
module.exports.updateTour = factory.updateOne(Tour);
module.exports.deleteTour = factory.deleteOne(Tour);

module.exports.topTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAvg,price';
	req.query.fields = 'name,ratingsAvg,difficulty,summary,price';
	next();
};

module.exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{ $match: { ratingsAvg: { $gte: 4.5 } } },
		{
			$group: {
				_id: '$difficulty',
				numTours: { $sum: 1 },
				numRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAvg' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
		{ $sort: { avgPrice: 1 } },
	]);

	res.status(200).json({
		status: 'success',
		data: { stats },
	});
});

module.exports.getMontlyPlan = catchAsync(async (req, res, next) => {
	const year = +req.params.year;

	const plan = await Tour.aggregate([
		{ $unwind: '$startDates' },
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTours: { $sum: 1 },
				tours: { $push: '$name' },
			},
		},
		{ $addFields: { month: '$_id' } },
		{ $project: { _id: 0 } },
		{ $sort: { numTours: -1 } },
	]);

	res.status(200).json({
		status: 'success',
		data: { plan },
	});
});
