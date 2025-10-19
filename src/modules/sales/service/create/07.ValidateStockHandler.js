import { ValidationError } from '../../../../core/errors/AppError.js';

export async function ValidateStockHandler(ctx, next) {
    const { op, qtyByProductId, stockDeltas, productById } = ctx;

    if (op.requiresStockCheck) {
        const insuficientes = [];
        for (const [pid, needQty] of qtyByProductId.entries()) {
            const p = productById.get(pid);
            const current = Number(p?.stock ?? 0);
            if (current < needQty)
                insuficientes.push({ product_id: pid, disponible: current, requerido: needQty });
        };

        if (insuficientes.length) {
            const detalle = insuficientes
                .map(x => `prod ${x.product_id}: disponible ${x.disponible}, requerido ${x.requerido}`)
                .join(' | ');
            throw new ValidationError(`Stock insuficiente para completar la venta: ${detalle}`, {
                details: { field: 'items', code: 'STOCK_INSUFFICIENT' }
            });
        };
    } else {
        const invalid = [];
        for (const [pid, delta] of stockDeltas.entries()) {
            if (delta < 0) {
                const p = productById.get(pid);
                const current = Number(p?.stock ?? 0);
                if (current + delta < 0)
                    invalid.push({ product_id: pid, resultante: current + delta });
            }
        };

        if (invalid.length) {
            const detalle = invalid
                .map(x => `prod ${x.product_id}: resultaría en stock negativo (${x.resultante})`)
                .join(' | ');
            throw new ValidationError(`Ajuste inválido: ${detalle}`, {
                details: { field: 'items', code: 'ADJUST_NEGATIVE_STOCK' }
            });
        };
    };

    await next();
}
