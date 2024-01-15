const Tour = require('./../models/tourModel');

module.exports.getAllTours = async (req, res) => {
	try {
		// Tour.find() returns a mongoose query obj
		// query obj has a Query.prototype which contains
		// methods like .where(), .each() etc
		// some more important things were mentioned, didn't understand

		// 1. Build query
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(field => delete queryObj[field]);

		const query = Tour.find(queryObj);

		// 2. Execute query
		const tours = await Tour.find(query);

		// 3. Send response
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
			// message: err,
			message: 'Could not update the document',
		});
	}
};

module.exports.deleteTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

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
