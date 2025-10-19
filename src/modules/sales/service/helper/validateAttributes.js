import { Messages } from '../../../../shared/messages.js';

const MAX_NUMERIC_10_2 = 99999999.99;

export function validateAttributes (payload, { partial = false } = {}) {
    const errors = [];
    const QUANTITY = "Cantidad del producto";
    const UNIT_PRICE = "Precio unitario";
    
    if (!partial)
        if (payload.kind_id === '' || payload.kind_id === undefined || payload.kind_id === null)
            errors.push(Messages.ERROR.REQUIRED("Tipo de Operacion"));

    if (!partial) 
        if (payload.state_id === '' || payload.state_id === undefined || payload.state_id === null)
            errors.push(Messages.ERROR.REQUIRED("Estado"));

    if (!partial){
        const pid = Number(payload.payment_id);
        if (!Number.isInteger(pid) || pid <= 0)
            errors.push(Messages.ERROR.REQUIRED("Metodo de pago"));
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0)
        errors.push(Messages.ERROR.REQUIRED("Items"));
    else
        payload.items.forEach((it, idx) => {
            if (it?.product_id == null || !Number.isInteger(Number(it.product_id)) || Number(it.product_id) <= 0)
                errors.push(`${Messages.ERROR.NUMBER_POSITIVE('ID del producto')} (item #${idx + 1})`);

            const q = Number(it?.quantity);
            if (it?.quantity === null || !Number.isFinite(q))
                errors.push(`${Messages.ERROR.REQUIRED(QUANTITY)} (item #${idx + 1})`);
            else if (Math.abs(q) > MAX_NUMERIC_10_2)
                errors.push(`${Messages.ERROR.MAX_CHARACTERS(QUANTITY, MAX_NUMERIC_10_2)} (item #${idx + 1})`);
    
            if (it?.unit_price !== undefined && it?.unit_price !== null && it?.unit_price !== '') {
                const up = Number(it.unit_price);
                if (!Number.isFinite(up)) {
                    errors.push(`${Messages.ERROR.INVALID_VALUE(UNIT_PRICE)} (item #${idx + 1})`);
                } else {
                    if (up < 0)
                        errors.push(`${Messages.ERROR.NUMBER_POSITIVE(UNIT_PRICE)} (item #${idx + 1})`);
                    if (!hasMaxScale(it.unit_price, 2))
                        errors.push(`${Messages.ERROR.INVALID_VALUE(UNIT_PRICE)} (item #${idx + 1})`);
                    if (Math.abs(up) > MAX_NUMERIC_10_2)
                        errors.push(`${Messages.ERROR.MAX_CHARACTERS(UNIT_PRICE, MAX_NUMERIC_10_2)} (item #${idx + 1})`);
                }
            }        
        });

    if (errors.length) 
        throw new ValidationError(errors.join(' '), { details: { fields: errors } });
};

function hasMaxScale(value, maxScale = 2) {
    const s = String(value);
    const parts = s.split('.');
    return parts.length === 1 || (parts[1]?.length ?? 0) <= maxScale;
};