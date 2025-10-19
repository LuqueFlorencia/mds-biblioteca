import { getDataSource } from '../../config/database.js';
import ProductSchema from './product.entity.js';
import { translateDbError } from '../../shared/translateDbError.js';
import { ValidationError, NotFoundError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';

const ENTITY = 'Producto';

export async function getAll({ page, pageSize, search = '', includeDeleted = false } = {}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(ProductSchema);

    const qb = repo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.category', 'c')
        .leftJoinAndSelect('p.unit', 'u');

    if (!includeDeleted)
        qb.where('p.is_deleted = FALSE');
    else
        qb.where('1=1');

    if (search && search.trim() !== '')
        qb.andWhere('(p.name ILIKE :q OR p.description ILIKE :q)', { q: `%${search.trim()}%` });

    const total = await qb.getCount();

    const effectivePage = page ? Number(page) : 1;
    const effectivePageSize = pageSize ? Number(pageSize) : total;

    qb.orderBy('p.id', 'ASC')
        .take(effectivePageSize)
        .skip((effectivePage - 1) * effectivePageSize);

    const items = await qb.getMany();

    items.forEach(item => {
        if (item.category) {
            item.category_id = item.category.id;
            item.category_name = item.category.name;
            delete item.category;
        }
        if (item.unit) {
            item.unit_id = item.unit.id;
            item.unit_name = item.unit.name;
            delete item.unit;
        }
    });

    return {
        items,
        total,
        page: effectivePage,
        pageSize: effectivePageSize,
        pages: Math.ceil(total / (effectivePageSize || 1)),
    };
};

export async function createNew(payload) {
    validateAttributes(payload, { partial: false });
    
    const ds = await getDataSource();
    await validateFKs(ds, payload);

    const repo = ds.getRepository(ProductSchema);

    try {
        const entity = repo.create({
            name: payload.name.trim(),
            description: payload.description ?? null,
            price: asNumber(payload.price),
            stock: asNumber(payload.stock),
            category: payload.category_id ? { id: Number(payload.category_id) } : null,
            unit: payload.unit_id ? { id: Number(payload.unit_id) } : null,
        });

        await repo.save(entity);
        return { id: entity.id, message: Messages.SUCCESS.CREATED(ENTITY) };
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function update(id, payload) {
    const ds = await getDataSource();
    const repo = ds.getRepository(ProductSchema);

    const product = await repo.findOne({ where: { id: Number(id), is_deleted: false } });
    if (!product) 
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    validateAttributes(payload, { partial: true });
    await validateFKs(ds, payload);

    if (payload.name !== undefined) product.name = payload.name.trim();
    if (payload.description !== undefined) product.description = payload.description ?? null;
    if (payload.price !== undefined) product.price = Number(asNumber(payload.price).toFixed(2));
    if (payload.stock !== undefined) product.stock = Number(asNumber(payload.stock).toFixed(2));
    if (payload.category_id !== undefined) product.category = payload.category_id ? { id: Number(payload.category_id) } : null;
    if (payload.unit_id !== undefined) product.unit = payload.unit_id ? { id: Number(payload.unit_id) } : null;
    
    try {
        const result = await repo.update({ id }, product);
        if (!result.affected)
            throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

        return { id, message: Messages.SUCCESS.UPDATED(ENTITY) };
    } catch (err) {
        translateDbError(err, { entity: ENTITY, onUnique: Messages.ERROR.DUPLICATE(ENTITY) });
    }
};

export async function softDelete(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(ProductSchema);

    const result = await repo.update({ id }, { is_deleted: true });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.DELETED(ENTITY) };
};

export async function restore(id) {
    const ds = await getDataSource();
    const repo = ds.getRepository(ProductSchema);

    const result = await repo.update({ id }, { is_deleted: false });
    if (!result.affected)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    return { id, message: Messages.SUCCESS.RESTORED(ENTITY) };
};

const asNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

function validateAttributes (payload, { partial = false } = {}) {
    const errors = [];
    const NOMBRE = 'nombre';
    const DESCRIPCION = 'descripcion';
    const PRECIO = 'precio';
    const STOCK = 'stock';
    const CATEGORY = 'id de la categoria';
    const UNIT = 'id de la unidad de medida';

    if (!partial || payload.name !== undefined) {
        const name = (payload.name ?? '').toString().trim();
        if (!name) 
            errors.push(Messages.ERROR.REQUIRED(NOMBRE));
        else if (name.length > 50) 
            errors.push(Messages.ERROR.MAX_CHARACTERS(NOMBRE, 50));
    };

    if (payload.description !== undefined) {
        const desc = payload.description == null ? null : String(payload.description);
        if (desc && desc.length > 250) 
            errors.push(Messages.ERROR.MAX_CHARACTERS(DESCRIPCION, 250));
    };

    if (!partial || payload.price !== undefined) {
        const price = asNumber(payload.price);
        if (price === null || Number.isNaN(price)) 
            errors.push(Messages.ERROR.REQUIRED(PRECIO));
        else if (price < 0) 
            errors.push(Messages.ERROR.NUMBER_POSITIVE(PRECIO));
    };

    if (!partial || payload.stock !== undefined) {
        const stock = asNumber(payload.stock);
        if (stock === null || Number.isNaN(stock)) 
            errors.push(Messages.ERROR.REQUIRED(STOCK));
        else if (stock < 0)
            errors.push(Messages.ERROR.NUMBER_POSITIVE(STOCK));
    };

    if (payload.category_id !== undefined && payload.category_id !== null) {
        const cid = Number(payload.category_id);
        if (!Number.isInteger(cid) || cid <= 0) 
            errors.push(Messages.ERROR.REQUIRED(CATEGORY));
    };

    if (payload.unit_id !== undefined && payload.unit_id !== null) {
        const uid = Number(payload.unit_id);
        if (!Number.isInteger(uid) || uid <= 0) 
            errors.push(Messages.ERROR.REQUIRED(UNIT));
    }

    if (errors.length) 
        throw new ValidationError(errors.join(' '), { details: { fields: errors } });
};

async function validateFKs (ds, { category_id, unit_id }) {
    if (category_id != null) {
        const exists = await ds.getRepository('Category').exist({ where: { id: Number(category_id) } });
        if (!exists) 
            throw new NotFoundError(Messages.ERROR.NOT_FOUND('Categoría indicada'));
    }
    if (unit_id != null) {
        const exists = await ds.getRepository('UnitMeasure').exist({ where: { id: Number(unit_id) } });
        if (!exists) 
            throw new NotFoundError(Messages.ERROR.NOT_FOUND('Unidad de Medida indicada'));
    }
};
