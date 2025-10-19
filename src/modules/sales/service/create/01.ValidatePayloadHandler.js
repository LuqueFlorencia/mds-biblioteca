import { ValidationError } from '../../../../core/errors/AppError.js';
import { validateAttributes } from '../helper/validateAttributes.js';

export async function ValidatePayloadHandler(ctx, next) {
    const { payload } = ctx;
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0)
        throw new ValidationError('Debe enviar items con al menos un elemento.', { code: 'NO_ITEMS' });

    validateAttributes(payload, { partial: false });
    await next();
};