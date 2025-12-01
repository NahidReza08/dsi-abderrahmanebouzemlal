import {
	createTaskSchema,
	updateTaskSchema,
	taskIdSchema,
	taskQuerySchema,
	userRegistrationSchema,
	userLoginSchema,
	userEmail,
	validateBothPasswords
} from './validation.js';

/**
 * Generic validation middleware factory
 */
const validate = (schema, property = 'body') => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req[property], {
			abortEarly: false,
			stripUnknown: true,
			allowUnknown: false
		});

		if (error) {
			const errorDetails = error.details.map((detail) => ({
				field: detail.path.join('.'),
				message: detail.message,
				type: detail.type
			}));

			return res.status(400).json({
				error: 'Validation Error',
				details: errorDetails
			});
		}

		req[property] = value;
		next();
	};
};

export const validateCreateTask = validate(createTaskSchema, 'body');
export const validateUpdateTask = validate(updateTaskSchema, 'body');
export const validateTaskId = validate(taskIdSchema, 'params');
export const validateTaskQuery = validate(taskQuerySchema, 'query');

// Custom validation for task completion
export const validateTaskCompletion = (req, res, next) => {
	if (req.body.status === 'completed' && !req.body.completedAt) {
		req.body.completedAt = new Date();
	}

	// Validate that actualTime is only set when status is completed
	if (req.body.actualTime && req.body.status !== 'completed') {
		return res.status(400).json({
			error: 'Validation failed',
			details: [
				{
					field: 'actualTime',
					message: 'Actual time can only be set for completed tasks',
					type: 'task.completion'
				}
			]
		});
	}

	next();
};

// Validate recurrence rules
export const validateRecurrence = (req, res, next) => {
	if (req.body.recurrence) {
		const { type, interval, endDate } = req.body.recurrence;

		if (type && !interval) {
			return res.status(400).json({
				error: 'Validation failed',
				details: [
					{
						field: 'recurrence.interval',
						message: 'Recurrence interval is required when type is specified',
						type: 'recurrence.interval'
					}
				]
			});
		}

		if (endDate && new Date(endDate) <= new Date()) {
			return res.status(400).json({
				error: 'Validation failed',
				details: [
					{
						field: 'recurrence.endDate',
						message: 'Recurrence end date must be in the future',
						type: 'date.future'
					}
				]
			});
		}
	}
	next();
};

export const validateUserRegistration = validate(userRegistrationSchema);
export const validateUserLogin = validate(userLoginSchema);
export const validateUserReset = validate(userEmail);
