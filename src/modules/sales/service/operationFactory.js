import { ValidationError } from '../../../core/errors/AppError.js';
import { Messages } from '../../../shared/messages.js';

// Helpers de mensajes
const QTY_FIELD = 'items.quantity';

function makeSaleOp() {
    return {
        requiresStockCheck: true,
        assertQuantity(q, pid) {
            if (!Number.isFinite(q)) {
                throw new ValidationError(`quantity inválida para product_id ${pid}.`, {
                details: { field: QTY_FIELD, code: 'INVALID_QUANTITY' }
                });
            }
            if (q <= 0) {
                throw new ValidationError(Messages.ERROR.NUMBER_POSITIVE('quantity') + ` (product_id ${pid})`, {
                details: { field: QTY_FIELD, code: 'NON_POSITIVE_QUANTITY' }
                });
            }
        },
        deltaFrom(qRaw) {
        return -Math.abs(Number(qRaw));
        },
    };
};

function makePurchaseOp() {
    return {
        requiresStockCheck: false,
        assertQuantity(q, pid) {
            if (!Number.isFinite(q)) {
                throw new ValidationError(`quantity inválida para product_id ${pid}.`, {
                details: { field: QTY_FIELD, code: 'INVALID_QUANTITY' }
                });
            }
            if (q <= 0) {
                throw new ValidationError(Messages.ERROR.NUMBER_POSITIVE('quantity') + ` (product_id ${pid})`, {
                details: { field: QTY_FIELD, code: 'NON_POSITIVE_QUANTITY' }
                });
            }
        },
        deltaFrom(qRaw) {
        return Math.abs(Number(qRaw));
        },
    };
};

function makeAdjustOp() {
    return {
        requiresStockCheck: false,
        assertQuantity(q, pid) {
            if (!Number.isFinite(q)) {
                throw new ValidationError(`quantity inválida para product_id ${pid}.`, {
                details: { field: QTY_FIELD, code: 'INVALID_QUANTITY' }
                });
            }
            if (q === 0) {
                throw new ValidationError(Messages.ERROR.INVALID_VALUE('quantity') + ` (product_id ${pid})`, {
                details: { field: QTY_FIELD, code: 'ZERO_QUANTITY' }
                });
            }
        },
        deltaFrom(qRaw) {
        return Number(qRaw); // con signo
        },
    };
};

export function makeOperation(kindInt) {
    switch (kindInt) {
        case 1: return makeSaleOp();     // Venta
        case 2: return makePurchaseOp(); // Compra
        case 3: return makeAdjustOp();   // Ajuste
        default: throw new Error('Operation kind inválido');
    }
};
