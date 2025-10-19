import { ValidationError } from '../../../../core/errors/AppError.js';

export async function AggregateItemsHandler(ctx, next) {
    const { items } = ctx.payload;

    ctx.uniqProductIds = [...new Set(items.map(i => Number(i.product_id)))];

    /** @type {Map<number, number>} */
    ctx.qtyByProductId = new Map();

    for (const it of items) {
        const pid  = Number(it.product_id);
        const qRaw = Number(it.quantity);

        if (!Number.isFinite(qRaw)) {
        throw new ValidationError(`quantity inválida para product_id ${pid}.`, {
            details: { field: 'items.quantity', code: 'INVALID_QUANTITY' }
        });
        }
        // Validación específica por operación (venta, compra, ajuste)
        ctx.op.assertQuantity(qRaw, pid);

        const qAbs = Math.abs(qRaw);
        ctx.qtyByProductId.set(pid, (ctx.qtyByProductId.get(pid) ?? 0) + qAbs);
    }

    await next();
}