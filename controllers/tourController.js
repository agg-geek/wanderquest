const { json } = require('express');
const Tour = require('./../models/tourModel');

module.exports.getAllTours = async (req, res) => {
	try {
		// 1. Build query
		//    a. Basic filtering
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach(field => delete queryObj[field]);

		//    b. Advanced filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		let query = Tour.find(JSON.parse(queryStr));

		//    c. Implement sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		//    d. Field limiting (projection)
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		//    e. Pagination
		const page = +req.query.page || 1;
		const limit = +req.query.limit || 10;
		const skip = (page - 1) * limit;

		query = query.skip(skip).limit(limit);

		if (req.query.page) {
			const cntDocuments = await Tour.countDocuments();
			if (skip >= cntDocuments) throw new Error('This page does not exist!');
		}

		// 2. Execute query
		const tours = await query;

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
