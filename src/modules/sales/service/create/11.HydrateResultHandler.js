import { SaleKind, SaleState } from '../../../../shared/enums.js';
import EntitySchema from '../../sale.entity.js';

export async function HydrateResultHandler(ctx, next) {
    const { em, savedSale } = ctx;
    const saleRepo = em.getRepository(EntitySchema);

    const result = await saleRepo.findOne({
        where: { id: savedSale.id },
        relations: { payment: true, items: { product: true } },
    });

    if (result?.payment) {
        result.payment_id = result.payment.id;
        result.payment_name = result.payment.name;
        delete result.payment;
    }

    if (result?.kind) {
        result.kind_id = result.kind;
        result.kind_name = SaleKind[result.kind] ?? 'Desconocido';
        delete result.kind;
    }

    if (result?.state) {
        result.state_id = result.state;
        result.state_name = SaleState[result.state] ?? 'Desconocido';
        delete result.state;
    }

    result.date = new Date(result.date).toISOString();

    if (Array.isArray(result?.items)) {
        result.items.forEach(res => {
        if (res.product) {
            res.product_id = res.product.id;
            res.product_name = res.product.name;
            delete res.product;
        }
        delete res.sale_id;
        delete res.is_deleted;
        });
    }

    ctx.result = result;
    await next();
}
