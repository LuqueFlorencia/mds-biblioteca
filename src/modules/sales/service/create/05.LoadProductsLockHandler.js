import { NotFoundError } from '../../../../core/errors/AppError.js';

export async function LoadProductsLockHandler(ctx, next) {
    const { em, uniqProductIds } = ctx;

    const products = await em
        .getRepository('Product')
        .createQueryBuilder('p')
        .setLock('pessimistic_write')
        .where('p.id IN (:...ids)', { ids: uniqProductIds })
        .andWhere('p.is_deleted = false')
        .getMany();

    ctx.productById = new Map(products.map(p => [p.id, p]));

    const missing = uniqProductIds.filter(id => !ctx.productById.has(id));
    if (missing.length) {
        throw new NotFoundError(`Los productos con id ${missing.join(', ')} no existen.`, {
        details: { field: 'items' }
        });
    };

    await next();
};
