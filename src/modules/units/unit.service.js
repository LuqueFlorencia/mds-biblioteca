import { getDataSource } from '../../config/database.js';
import UnitSchema from './unit.entity.js';
import { translateDbError } from '../../shared/translateDbError.js';
import { ValidationError, NotFoundError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';

const ENTITY = 'Unidad de Medida';

export async function getAll({ includeDeleted = false } = {} ) {
    const db = await getDataSource();
    const repo = db.getRepository(UnitSchema);

    const where = includeDeleted ? {} : { is_deleted: false };

    const units = await repo.find({
        select: ['id', 'name', 'description', 'is_deleted'],
        where,
        order: { id: 'ASC' },
    });

    return units;
};

export async function createNew(unit) {
    validateAttributes(unit, { partial: false });

    const ds = await getDataSource();
    const repo = ds.getRepository(UnitSchema);

    try {
        const entity = repo.create({ name: unit.name.trim(), description: unit.description?.trim() });
        await repo.save(entity);
        return { id: entity.id, message: Messages.SUCCESS.CREATED(ENTITY) };
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function update(id, unit) {
    validateAttributes(unit, { partial: true });

    const ds = await getDataSource();
    const repo = ds.getRepository(UnitSchema);

    try {
        const result = await repo.update({ id }, { name: unit.name.trim(), description: unit.description?.trim() });
        if (result.affected)
            throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

        return { id, message: Messages.SUCCESS.UPDATED(ENTITY) }    
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function softDelete(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(UnitSchema);

    const result = await repo.update({ id }, { is_deleted: true });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.DELETED(ENTITY) };
};

export async function restore(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(UnitSchema);

    const result = await repo.update({ id }, { is_deleted: false });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.RESTORED(ENTITY) };
};


function validateAttributes (payload, { partial = false } = {}) {
    const errors = [];
    const NOMBRE = 'nombre';
    const DESCRIPCION = 'descripcion';

    if (!partial || payload.name !== undefined) {
        const name = (payload.name ?? '').toString().trim();
        if (!name) 
            errors.push(Messages.ERROR.REQUIRED(NOMBRE));
        else if (name.length > 10) 
            errors.push(Messages.ERROR.MAX_CHARACTERS(NOMBRE, 10));
    }

    if (payload.description !== undefined) {
        const desc = payload.description == null ? null : String(payload.description);
        if (desc && desc.length > 50) 
            errors.push(Messages.ERROR.MAX_CHARACTERS(DESCRIPCION, 50));
    }

    if (errors.length) 
        throw new ValidationError(errors.join(' '), { details: { fields: errors } });
};