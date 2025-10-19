import { Messages } from '../../../../shared/messages.js';
import { BadRequestError } from '../../../../core/errors/AppError.js';

export function ensureIsoDateOrFail(value, fieldName) {
    if (typeof value !== 'string' || !value.trim())
        throw new BadRequestError(Messages.ERROR.DATE_REQUIRED(fieldName));

    if (!value.endsWith('Z'))
        throw new BadRequestError(`${fieldName} debe venir en ISO UTC con 'Z'`);

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) 
        throw new BadRequestError(Messages.ERROR.DATE_VALID(fieldName));

    return d;
};