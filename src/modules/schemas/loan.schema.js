import Joi from 'joi';

export const loanCreateRequest = Joi.object({
    memberId:    Joi.number().integer().required(),
    librarianId: Joi.number().integer().required(),
    copyId:      Joi.number().integer().required(),
    dateFrom:    Joi.string().isoDate().required(),
    dateTo:      Joi.string().isoDate().required(),
});

export const returnLoanRequest = Joi.object({
    damaged:      Joi.boolean().default(false),
    damageAmount: Joi.number().min(0).default(0),
});

export const activeLoansQuery = Joi.object({
    memberId:    Joi.number().integer().positive().optional(),
    librarianId: Joi.number().integer().positive().optional(),
    limit:       Joi.number().integer().min(1).max(200).default(50),
    offset:      Joi.number().integer().min(0).default(0),
});
