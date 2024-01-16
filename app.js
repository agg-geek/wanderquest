const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	const err = new Error(`Cannot find ${req.originalUrl} on this server`); // this is err.message
	err.status = 'fail';
	err.statusCode = 404;
	// whenever we pass any argument into next, express will automatically consider it as an error
	// express will skip any normal middleware in next() and straight away go to the error handling middleware
	next(err);
});

// express will recognise this as error handling middleware
// as it consists of 4 params
// so this is only called when an error has occurred
app.use((err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
});

module.exports = app;
