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

module.exports.createTour = (req, res) => {};

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
