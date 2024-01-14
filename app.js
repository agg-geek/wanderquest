const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// serving static files from public folder
// if file is in /public/img/image.png, then
// /img/image.png is how the file will be served and not /public/img/image.png
// also note /img/ path will not be served as express considers it to be a normal route
// and route /img/ has not been implemented
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
