const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ===============================
// used to set important security headers
// you should keep it at the top so all correct headers are set
// for all req-res
app.use(helmet());
// ===============================

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// ===============================
// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});
// rateLimit is a middleware so apply it to the API route
// checkout the headers of any response, you will see
// X-RateLimit-Limit and X-RateLimit-Remaining headers
// make max: 3 and use all requests,then error 429: too many requests
// is shown with the message 'too many req...' mentioned above
app.use('/api', limiter);
// ===============================

// ===============================
// Body parser middleware, any body larger than 10kb will not be accepted
app.use(express.json({ limit: '10kb' }));
// ===============================

// Data sanitization against NoSQL query injection
// login with data { "email": { "$gt": "" }, "password": "12345678" }
// where the password is a real password of any user
// make sure to perform this sanitization after parsing the body
app.use(mongoSanitize());
// ===============================

// Data sanitization against XSS
app.use(xssClean());
// ===============================

// Prevent parameter pollution
// getAllTours with query ?sort=field&sort=price
// now, req.query.sort = ['field', 'price'] and if you check, you
// needed a string 'field,price'
// hence use HTTP parameter pollution package hpp to solve this
// hpp will ignore field and only use sort=price

// however, we want all tours with ?duration=5&duration=9
app.use(hpp({ whitelist: ['difficulty'] }));
// ===============================

app.use(express.static(`${__dirname}/public`));

// can be used to check the headers on every request
// app.use((req, res, next) => {
// 	console.log(req.headers);
// 	next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
