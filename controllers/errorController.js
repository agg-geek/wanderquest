const AppError = require('./../utils/appError');

const handleDBCastError = err => {
	// err contains path: '_id' which is the variable with wrong objectid
	// err also contains value as 'www' which is the invalid objectid
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
		// for production, we separate the errors into operational and non-operational
		// the errors we generate ourselves are operational errors, which have been generated using AppError
		// because we trust these operational errors, we show more meaningful info to the client for these errors
		// however, there are some other errors created by mongoose/mongodb which we can handle (can trust) but they are not operational
		// they aren't operational simply because we didn't create them and they don't have isOperational
		// hence we simply show 500 status 'Something went wrong'
		// however, we handle them here
		// see the exact error through 'error: err' in dev mode (clg in prod mode doesn't show the err)
		// there are multiple such errors, which we handle one by one:

		// 1. getTour with id 'www', this is an invalid mongodb ObjectId
		// (there is difference bw invalid mongodb ObjectId and valid objectid for which document does not exist)
		// this error (as seen through dev mode error: err) has name CastError, and is handled below
		if (err.name === 'CastError') err = handleDBCastError(err);
		sendProdError(err, res);
	}
};
