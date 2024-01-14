const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const exp = require('constants');

const app = express();

// using 3rd party middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// =====================================================================

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-files/data/tours-simple.json`));

const getAllTours = (req, res) => {
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

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

// =====================================================================

const getAllUsers = (req, res, next) => {
	res.status(500).json({
		// notice 500: internal server error
		status: 'error',
		message: 'This route is not yet defined',
	});
};
const getUser = (req, res, next) => {
	res.status(500).json({
		// notice 500: internal server error
		status: 'error',
		message: 'This route is not yet defined',
	});
};
const createUser = (req, res, next) => {
	res.status(500).json({
		// notice 500: internal server error
		status: 'error',
		message: 'This route is not yet defined',
	});
};
const updateUser = (req, res, next) => {
	res.status(500).json({
		// notice 500: internal server error
		status: 'error',
		message: 'This route is not yet defined',
	});
};
const deleteUser = (req, res, next) => {
	res.status(500).json({
		// notice 500: internal server error
		status: 'error',
		message: 'This route is not yet defined',
	});
};

// =====================================================================

const tourRouter = express.Router();
// prettier-ignore
tourRouter
    .route('/') // notice '/' route
    .get(getAllTours)
    .post(createTour);

// prettier-ignore
tourRouter
    .route('/:id') // notice '/:id' route
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.use('/api/v1/tours', tourRouter);

// =====================================================================

const userRouter = express.Router();

// prettier-ignore
userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// prettier-ignore
userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/users', userRouter);

// =====================================================================

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
