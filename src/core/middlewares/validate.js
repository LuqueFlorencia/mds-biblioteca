import Joi from 'joi';
import { ValidationError } from '../errors/AppError.js';

const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
};

function mapJoiDetailToMessage(d) {
    return d.message;
}

export function validate(schema, source = 'body', options = {}) {
    const opts = { ...defaultOptions, ...options };

    return (req, _res, next) => {
        const data = req[source];
        const { error, value } = schema.validate(data, opts);

        if (error) {
            const fields = error.details.map(mapJoiDetailToMessage);
            return next(new ValidationError(fields.join(' ')));
        }

        // Reemplaza por el valor “sanitizado”
        req[source] = value;
        next();
    };
}

// Helpers cómodos
export const validateBody  = (schema, options) => validate(schema, 'body',  options);
export const validateQuery = (schema, options) => validate(schema, 'query', options);
export const validateParams= (schema, options) => validate(schema, 'params',options);