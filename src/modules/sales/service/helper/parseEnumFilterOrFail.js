import { Messages } from '../../../../shared/messages.js';
import { BadRequestError } from '../../../../core/errors/AppError.js';

export function parseEnumFilterOrFail(value, paramName, allowed) {
    if (value === '' || value === null || value === undefined) return [];

    const arr = Array.isArray(value)
        ? value
        : String(value).split(',').map(v => v.trim()).filter(v => v !== '');

    if (arr.length === 0) return [];

    const result = [];
    for (const v of arr) {
        const n = Number(v);
        if (!Number.isInteger(n) || n <= 0) {
            throw new BadRequestError(Messages.ERROR.NUMBER_POSITIVE(paramName));
        }
        if (!allowed.includes(n)) {
            throw new BadRequestError(Messages.ERROR.INVALID_VALUE(paramName));
        }
        result.push(n);
    }
    return [...new Set(result)];
}