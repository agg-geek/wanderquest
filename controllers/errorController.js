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
		// Our custom errors, trustable, can send this to the client
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// some unexpected programming error / bug, don't send to client
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
		sendProdError(err, res);
	}
};
