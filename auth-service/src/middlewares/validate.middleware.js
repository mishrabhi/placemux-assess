import Joi from 'joi';
import errorResponse from "../middlewares/error.middleware.js"

const schemas = {
  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string().valid('candidate', 'admin').default('candidate'),
    experienceLevel: Joi.string().valid('fresher', 'experienced').required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refresh: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  logout: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

/**
 * Returns a middleware that validates req.body against the named schema.
 * Usage: validate('signup')
 */
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return errorResponse(res, { statusCode: 500, message: `Unknown validation schema: ${schemaName}` });
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return errorResponse(res, { statusCode: 400, message: 'Validation failed', errors });
    }

    req.body = value;
    next();
  };
}

export default validate;
