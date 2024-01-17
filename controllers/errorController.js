const AppError = require('./../utils/appError');

const handleDBCastError = err => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDBDuplicateError = err => {
	const fieldName = Object.keys(err.keyValue)[0];
	const fieldValue = Object.values(err.keyValue)[0];
	const message = `Duplicate ${fieldName} value: '${fieldValue}'`;
	return new AppError(message, 400);
};

const handleDBValidationError = err => {
	const errors = Object.values(err.errors).map(err => err.message);
	const message = `Invalid input data. ${errors.join('. ')}.`;
	return new AppError(message, 400);
};

const handleJWTInvalidSignature = () =>
	new AppError('Invalid token. Please login again.', 401);

const handleJWTExpiredError = () =>
	new AppError('Token expired. Please login again.', 401);

const sendDevError = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err,
	});
};

const sendProdError = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error(err);
		res.status(err.statusCode).json({
			status: '500',
			message: 'Something went wrong',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendDevError(err, res);
	} else {
		if (err.name === 'CastError') err = handleDBCastError(err);
		if (err.code === 11000) err = handleDBDuplicateError(err);
		if (err.name === 'ValidationError') err = handleDBValidationError(err);
		if (err.name === 'JsonWebTokenError') err = handleJWTInvalidSignature();
		if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
		sendProdError(err, res);
	}
};
