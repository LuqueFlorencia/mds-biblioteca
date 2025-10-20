import Joi from 'joi';

export const bookCreateRequest = Joi.object({
    isbn:   Joi.string().max(250).required(),
    title:  Joi.string().max(250).required(),
    author: Joi.string().max(250).required(),
    copies: Joi.number().integer().min(1).default(1),
});

export const bookSearchQuery = Joi.object({
    search: Joi.string().max(250).allow('').optional(),
});

export const listAvailQuery = Joi.object({
    search: Joi.string().allow('').optional(),
    limit:  Joi.number().integer().min(1).max(200).default(50),
    offset: Joi.number().integer().min(0).default(0),
});