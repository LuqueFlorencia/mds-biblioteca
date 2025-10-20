import Joi from 'joi';

export const listDebtsQuery = Joi.object({
    onlyUnpaid: Joi.boolean().default(true),
});

export const payDebtBody = Joi.object({}).optional();
