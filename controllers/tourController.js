const APIFeatures = require('./../utils/apiFeatures');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

module.exports.topTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAvg,price';
	req.query.fields = 'name,ratingsAvg,difficulty,summary,price';
	next();
};

module.exports.getAllTours = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(Tour.find(), req.query);
	features.filter().sort().limitFields().paginate();

	const tours = await features.query;

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: { tours },
	});
});

module.exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id);

	// getTour with a valid ObjectID format but an ID which does not exist
	// we would get { "status": "success", "data": { "tour": null } }
	// status is success with tour is null as mongoose does not find a tour with that ID
	// notice returning next(err), otherwise we will send 2 responses
	if (!tour) return next(new AppError('No tour found with that ID', 404));

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

module.exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({
		status: 'success',
		data: { tour: newTour },
	});
});

module.exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!tour) return next(new AppError('No tour found with that ID', 404));

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
});

module.exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

	if (!tour) return next(new AppError('No tour found with that ID', 404));

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

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
