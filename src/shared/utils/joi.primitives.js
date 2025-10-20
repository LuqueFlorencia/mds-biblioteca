import Joi from 'joi';

// String no vacío (trim)
export const nonEmptyString = Joi.string().trim().min(1);

// Id entero positivo
export const idRef = Joi.number().integer().positive();

// Dinero/decimal no negativo (permite strings numéricas)
export const money = Joi.number().min(0);

// Para rutas que usan memberId/librarianId/copyId en path:
export const memberIdParamSchema = Joi.object({
  	memberId: Joi.number().integer().positive().required(),
});
export const librarianIdParamSchema = Joi.object({
  	librarianId: Joi.number().integer().positive().required(),
});
export const copyIdParamSchema = Joi.object({
  	copyId: Joi.number().integer().positive().required(),
});

// Valida :id en params
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        'number.base': 'El identificador debe ser un número entero.',
        'number.integer': 'El identificador debe ser un número entero.',
        'number.positive': 'El identificador debe ser un número positivo.',
        'any.required': 'El identificador es obligatorio.',
    }),
});