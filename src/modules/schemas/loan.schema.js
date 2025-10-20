import Joi from 'joi';

export const loanCreateRequest = Joi.object({
    memberId: Joi.number().integer().required(),
    librarianId: Joi.number().integer().required(),
    copyId: Joi.number().integer().required(),
    dateFrom: Joi.string().isoDate().required(),
    dateTo: Joi.string().isoDate().required(),
});

export const returnLoanRequest = Joi.object({
    damaged: Joi.boolean().default(false),
    damageAmount: Joi.number().min(0).default(0),
});
