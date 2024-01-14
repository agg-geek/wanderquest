const Tour = require('./../models/tourModel');

module.exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		// results: tours.length,
		// data: { tours },
	});
};

module.exports.getTour = (req, res) => {
	const tourId = Number(req.params.id);
	// const tour = tours.find(tour => tour.id === tourId);

	res.status(200).json({
		status: 'success',
		// data: { tour },
	});
};

module.exports.createTour = async (req, res) => {
	// the difference between this method and using create is that
	// .save() exists on the instance of Tour
	// .create() exists on the Tour itself
	// const newTour = new Tour({});
	// newTour.save();

	console.log(req.body);

	try {
		// using .create will actually create and store the tour in db,
		// just like .save() did
		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: 'success',
			data: { tour: newTour },
		});
	} catch (err) {
		// errors like mongoose validation errors will be caught here
		// console.log(err);
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

module.exports.updateTour = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Updated tour here...>',
		},
	});
};

module.exports.deleteTour = (req, res) => {
	res.status(204).json({
		status: 'success',
		data: null,
	});
};
