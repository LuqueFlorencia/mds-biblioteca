import { ensureIsoDateOrFail } from '../helper/ensureIsoDateOrFail.js';
import { toMoney } from '../helper/toMoney.js';
import EntitySchema from '../../sale.entity.js';

export async function PersistSaleHandler(ctx, next) {
    const { em, payload, saleItems, total, kindInt, stateInt } = ctx;
    const { payment_id, date } = payload;

    const saleRepo = em.getRepository(EntitySchema);

    const saleEntity = saleRepo.create({
        payment: { id: Number(payment_id) },
        total: toMoney(total),
        kind:  kindInt,
        state: stateInt,
        date:  ensureIsoDateOrFail(date, 'Fecha de registro'),
        items: saleItems,
    });

    ctx.savedSale = await saleRepo.save(saleEntity);
    await next();
}
