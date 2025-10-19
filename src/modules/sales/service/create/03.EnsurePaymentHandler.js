import { NotFoundError } from '../../../../core/errors/AppError.js';

export async function EnsurePaymentHandler(ctx, next) {
    const { em, payload } = ctx;
    const paymentRepo = em.getRepository('Payment');

    const payExists = await paymentRepo.exist({ where: { id: Number(payload.payment_id) } });
    if (!payExists)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND('Método de pago'));

    await next();
};