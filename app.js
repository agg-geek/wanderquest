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

// notice app.all for all HTTP verbs and * for all urls
// also handle this route after all the above routes
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		message: `Cannot find ${req.originalUrl} on this server`,
	});
});

module.exports = app;
