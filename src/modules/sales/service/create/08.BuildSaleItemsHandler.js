import { toMoney } from '../helper/toMoney.js';

export async function BuildSaleItemsHandler(ctx, next) {
    const { items, date, payment_id } = ctx.payload;
    const { productById } = ctx;

    ctx.saleItems = items.map((it) => {
        const product = productById.get(Number(it.product_id));
        const qAbs    = Math.abs(Number(it.quantity));

        const providedUnitPrice = it?.unit_price !== undefined && it?.unit_price !== null && it?.unit_price !== ''
        ? Number(it.unit_price)
        : undefined;

        const baseUnitPrice = providedUnitPrice ?? Number(product?.price ?? 0);

        const unit_price = toMoney(baseUnitPrice);
        const subtotal   = toMoney(qAbs * unit_price);

        return { product, quantity: qAbs, unit_price, subtotal };
    });

    ctx.total = ctx.saleItems.reduce((acc, si) => acc + si.subtotal, 0);

    await next();
}
