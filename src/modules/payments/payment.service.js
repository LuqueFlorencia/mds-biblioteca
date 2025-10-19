import { getDataSource } from "../../config/database.js";
import PaymentSchema from './payment.entity.js';
import { translateDbError } from '../../shared/translateDbError.js';
import { ValidationError, NotFoundError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';

const ENTITY = 'Metodo de Pago';

export async function getAll( { includeDeleted = false } = {} ) {  
    const ds = await getDataSource();
    const repo = ds.getRepository(PaymentSchema);

    const where = includeDeleted ? {} : { is_deleted: false };

    return await repo.find({
        select: ['id', 'name', 'is_deleted'],
        where,
        order: { id: 'ASC' },
    });
};

export async function createNew(payment) {
    validateAttributes(payment, { partial: false });

    const ds = await getDataSource();
    const repo = ds.getRepository(PaymentSchema);

    try {
        const entity = repo.create({ name: payment.name.trim() });
        await repo.save(entity);
        return { id: entity.id, message: Messages.SUCCESS.CREATED(ENTITY) };
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function update(id, payment) {
    validateAttributes(payment, { partial: true });

    const ds = await getDataSource();
    const repo = ds.getRepository(PaymentSchema);

    try {
        const result = await repo.update({ id }, { name: payment.name.trim() });
        if (!result.affected)
            throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));
    
        return { id, message: Messages.SUCCESS.UPDATED(ENTITY) };
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function softDelete(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(PaymentSchema);

    const result = await repo.update({ id }, { is_deleted: true });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.DELETED(ENTITY) };
};

export async function restore(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(PaymentSchema);

    const result = await repo.update({ id }, { is_deleted: false });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.RESTORED(ENTITY) };
};


function validateAttributes (payload, { partial = false } = {}) {
    const errors = [];
    const NOMBRE = 'nombre';

    if (!partial || payload.name !== undefined) {
        const name = (payload.name ?? '').toString().trim();
        if (!name) 
            errors.push(Messages.ERROR.REQUIRED(NOMBRE));
        else if (name.length > 10) 
            errors.push(Messages.ERROR.MAX_CHARACTERS(NOMBRE, 10));
    }

    if (errors.length) 
        throw new ValidationError(errors.join(' '), { details: { fields: errors } });
};

