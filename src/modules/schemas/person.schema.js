import Joi from 'joi';

export const memberCreateRequest = Joi.object({
  name:         Joi.string().max(250).required(),
  lastname:     Joi.string().max(250).required(),
  dni:          Joi.string().pattern(/^\d{7,10}$/).optional(),
});

export const librarianCreateRequest = Joi.object({
  name:       Joi.string().max(250).required(),
  lastname:   Joi.string().max(250).required(),
  dni:        Joi.string().pattern(/^\d{7,10}$/).optional(),
});
