const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-files/data/tours-simple.json`));

// console.log(__dirname); // returns path till /controllers
// hence notice the use of '{__dirname}/../' since
// dirname rerfers to controllers folder
// and not the root folder in which app.js is present

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

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(200).json({
		status: 'success',
		data: { tour },
	});
};

module.exports.createTour = (req, res) => {
	const tourId = tours.at(-1).id + 1;
	const newTour = Object.assign({ id: tourId }, req.body);
	tours.push(newTour);

	fs.writeFile(`${__dirname}/dev-files/data/tours-simple.json`, JSON.stringify(tours), err => {
		res.status(201).json({
			status: 'success',
			data: { newTour },
		});
	});
};

module.exports.updateTour = (req, res) => {
	const tourId = Number(req.params.id);
	if (tourId > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Updated tour here...>',
		},
	});
};

module.exports.deleteTour = (req, res) => {
	const tourId = Number(req.params.id);
	if (tourId > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};
