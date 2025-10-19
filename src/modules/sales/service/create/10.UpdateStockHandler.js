export async function UpdateStockHandler(ctx, next) {
    const { em, stockDeltas } = ctx;

    for (const [pid, delta] of stockDeltas.entries()) {
        if (delta === 0) continue;
        await em
        .createQueryBuilder()
        .update('Product')
        .set({ stock: () => 'stock + :delta' })
        .where('id = :id', { id: pid })
        .setParameter('delta', delta)
        .execute();
    };

    await next();
}
