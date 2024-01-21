const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) return next(new AppError('No document found with that ID', 404));

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

exports.updateOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) return next(new AppError('No document found with that ID', 404));

		res.status(200).json({
			status: 'success',
			data: { doc },
		});
	});

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: { doc },
		});
	});

exports.getOne = (Model, populateOptions) =>
	catchAsync(async (req, res, next) => {
		// notice how you are doing the populate
		// create a query, don't await it, just pass the populate
		// and then await the query
		let query = Model.findById(req.params.id);
		if (populateOptions) query = query.populate(populateOptions);
		const doc = await query;

		if (!doc) return next(new AppError('No document found with that ID', 404));

		res.status(200).json({
			status: 'success',
			data: { doc },
		});
	});

exports.getAll = (Model, filter) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const doc = await features.query;

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: { doc },
		});
	});
