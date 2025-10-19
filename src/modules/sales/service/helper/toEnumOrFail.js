import { Messages } from '../../../../shared/messages.js';
import { BadRequestError } from '../../../../core/errors/AppError.js';

export function toEnumOrFail(value, fieldName, allowed) {
    if (value === '' || value === null || value === undefined)
        throw new BadRequestError(Messages.ERROR.REQUIRED(fieldName));

    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0)
        throw new BadRequestError(Messages.ERROR.NUMBER_POSITIVE(fieldName));

    if (!allowed.includes(n)) 
        throw new BadRequestError(Messages.ERROR.INVALID_VALUE(fieldName));

    return n;
};