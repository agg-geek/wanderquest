const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-files/data/tours-simple.json`));

module.exports.validateId = (req, res, next, val) => {
	if (Number(req.params.id) > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}
	next();
};

// validateTour when creating a new tour through POST
// the tour should have name and price
module.exports.validateTour = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: 'fail',
			message: 'Missing tour name or price',
		});
	}
	next();
};

module.exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: { tours },
	});
};

module.exports.getTour = (req, res) => {
	const tourId = Number(req.params.id);
	const tour = tours.find(tour => tour.id === tourId);

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
};

module.exports.createTour = (req, res) => {
	const tourId = tours.at(-1).id + 1;
	const newTour = Object.assign({ id: tourId }, req.body);
	tours.push(newTour);

	fs.writeFile(`${__dirname}/../dev-files/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: 'success',
			data: { newTour },
		});
	});
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
