export class APIError extends Error {
	constructor(message, name, status) {
		super();
		this.message = message;
		this.name = name;
		this.status = status;
	}
}

export const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	let status = err.status || 500;
	let message = err.message || 'Internal Server Error';

	if (err.name === 'ValidationError') {
		status = 400;
		message = 'Validation Error';
	}

	if (err.name === 'UnauthorizedError') {
		status = 401;
		message = 'Unauthorized';
	}

	if (err.name === 'ForbidenError') {
		status = 403;
		message = 'Forbiden';
	}

	res.status(status).json({
		error: message,
		...(process.env.APP_STAGE === 'dev' && {
			stack: err.stack,
			details: err.message
		})
	});
};

export const notFound = (req, res, next) => {
	const error = new APIError(`Not found - ${req.originalUrl}`, NotFoundError, 404);
	next(error);
};
