const AppError = require('./../utils/appError');

const handleDBCastError = err => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

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
		// ===============================
		// BUG: why aren't original and duplicates the same?
		let error = { ...err };
		res.json({
			original: err,
			duplicate: error,
		});
		// if (error.name === 'CastError') error = handleDBCastError(error);
		// sendProdError(error, res);
		// ===============================

		// if (err.name === 'CastError') err = handleDBCastError(err);
		// sendProdError(err, res);
	}
};
