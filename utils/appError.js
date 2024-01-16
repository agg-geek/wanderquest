// our class extends the builtin Error class
class AppError extends Error {
	constructor(message, statusCode) {
		super(message); // msg is the only parameter that builtin Error class constructor expects
		this.statusCode = statusCode;
		this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';

		// we will handle only operational errors through this class, not programming errors
		// isOperational will be used to distinguish non-operational errors
		this.isOperational = true;

		// when an error happens, the stack trace will not contain this constructor
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
