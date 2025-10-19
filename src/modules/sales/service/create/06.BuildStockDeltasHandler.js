export async function BuildStockDeltasHandler(ctx, next) {
    const { items } = ctx.payload;
    const { op } = ctx;

    /** @type {Map<number, number>} */
    ctx.stockDeltas = new Map();

    for (const it of items) {
        const pid  = Number(it.product_id);
        const qRaw = Number(it.quantity);
        const delta = op.deltaFrom(qRaw);
        ctx.stockDeltas.set(pid, (ctx.stockDeltas.get(pid) ?? 0) + delta);
    }

    await next();
};
