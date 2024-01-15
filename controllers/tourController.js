const APIFeatures = require('./../utils/apiFeatures');
const Tour = require('./../models/tourModel');

module.exports.topTours = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ratingsAvg,price';
	req.query.fields = 'name,ratingsAvg,difficulty,summary,price';
	next();
};

module.exports.getAllTours = async (req, res) => {
	try {
		const features = new APIFeatures(Tour.find(), req.query);
		features.filter().sort().limitFields().paginate();

		const tours = await features.query;

		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: { tours },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err,
		});
	}
};

module.exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: 'Tour not found',
		});
	}
};

module.exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { tour: newTour },
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

module.exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			data: { tour },
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: 'Could not update the document',
		});
	}
};

module.exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id, req.body);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: 'Could not delete the document',
		});
	}
};

module.exports.getTourStats = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			message: 'Could not get statistics',
		});
	}
};

module.exports.getMontlyPlan = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			message: 'Could not get statistics',
		});
	}
};
