const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	console.log('Hello from the middleware!');
	next(); // important
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next(); // important
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-files/data/tours-simple.json`));

const getAllTours = (req, res) => {
	console.log(req.requestTime);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: { tours },
	});
};

const getTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
	const tourId = Number(req.params.id);
	if (tourId > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});
	}

	// notice 204 response
	res.status(204).json({
		status: 'success',
		data: null, // notice!
	});
};

// prettier-ignore
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

// prettier-ignore
app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
