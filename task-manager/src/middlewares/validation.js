import Joi from 'joi';
import passport from 'passport';

const commonValidators = {
  id: Joi.string().hex().length(24).message('Invalid ID format'),
  title: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().trim().max(2000).allow('', null),
  date: Joi.date().iso().greater('now').allow(null),
  pastDate: Joi.date().iso().allow(null),
  time: Joi.number().integer().min(0).max(10080),
  status: Joi.string().valid(
    'todo',
    'in_progress',
    'review',
    'completed',
    'cancelled'
  ),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.pattern.base': 'First name can only contain letters and spaces'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/),

  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'string.empty': 'Password is required'
    }),

  username: Joi.string().alphanum().min(3).max(30).trim().optional().messages({
    'string.alphanum': 'Username can only contain letters and numbers'
  })
};

// Task creation validation schema
export const createTaskSchema = Joi.object({
  title: commonValidators.title,
  description: commonValidators.description,
  status: commonValidators.status.default('todo'),
  priority: commonValidators.priority.default('medium'),
  dueDate: commonValidators.date,
  startDate: commonValidators.date,
  estimatedTime: commonValidators.time.allow(null),
  actualTime: Joi.number().integer().min(0).allow(null),
  recurrence: Joi.object({
    type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
    interval: Joi.number().integer().min(1).max(365),
    endDate: commonValidators.date
  }).allow(null),
  completedAt: commonValidators.pastDate
});

// Task update validation schema
export const updateTaskSchema = Joi.object({
  title: commonValidators.title.optional(),
  description: commonValidators.description.optional(),
  status: commonValidators.status.optional(),
  priority: commonValidators.priority.optional(),
  dueDate: commonValidators.date.optional(),
  startDate: commonValidators.date.optional(),
  estimatedTime: commonValidators.time.allow(null).optional(),
  actualTime: Joi.number().integer().min(0).allow(null).optional(),
  recurrence: Joi.object({
    type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly'),
    interval: Joi.number().integer().min(1).max(365),
    endDate: commonValidators.date
  })
    .allow(null)
    .optional(),
  completedAt: commonValidators.pastDate.optional(),
  isDeleted: Joi.boolean().optional()
}).min(1); // At least one field must be provided for update

// ID parameter validation schema
export const taskIdSchema = Joi.object({
  id: commonValidators.id.required()
});

// Query parameters validation schema (for filtering, pagination, etc.)
export const taskQuerySchema = Joi.object({
  status: commonValidators.status.optional(),
  priority: commonValidators.priority.optional(),
  dueDateFrom: commonValidators.date.optional(),
  dueDateTo: commonValidators.date.optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid('dueDate', 'createdAt', 'priority', 'title')
    .default('dueDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

export const userRegistrationSchema = Joi.object({
  firstName: commonValidators.firstName,
  lastName: commonValidators.lastName,
  username: commonValidators.username,
  email: commonValidators.email,
  password: commonValidators.password
});

export const userLoginSchema = Joi.object({
  email: commonValidators.email,
  password: commonValidators.password
});

export const userEmail = Joi.object({
  email: commonValidators.email
});

export const validateBothPasswords = Joi.object({
  password: commonValidators.password,
  confirmPassword: commonValidators.password
});
