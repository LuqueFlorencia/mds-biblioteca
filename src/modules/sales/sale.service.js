import { getDataSource } from "../../config/database.js";
import EntitySchema from './sale.entity.js';
import { saleChain } from './service/create/saleChain.js';
import { parseEnumFilterOrFail } from './service/helper/parseEnumFilterOrFail.js';
import { NotFoundError, BadRequestError } from '../../core/errors/AppError.js';
import { Messages } from '../../shared/messages.js';
import { SaleKind, SALE_KIND_VALUES, SaleState, SALE_STATE_VALUES } from '../../shared/enums.js';

/**
 * Lista ventas con paginado + filtros.
 * @param {Object} opts
 * @param {number|string} [opts.page=1]
 * @param {number|string} [opts.pageSize=20]  // aceptar 'all' si querés todo
 * @param {string} [opts.payment]             // búsqueda parcial por nombre de medio de pago (ILIKE)
 * @param {string} [opts.kind]                // búsqueda por tipo de movimiento
 * @param {string} [opts.state]               // búsqueda por estado de movimiento
 * @param {string} [opts.day]                 // ISO 'yyy-mm-ddTHH:mm:ssZ'
 * @param {string} [opts.dateFrom]            // ISO 'yyy-mm-ddTHH:mm:ssZ'
 * @param {string} [opts.dateTo]              // ISO 'yyy-mm-ddTHH:mm:ssZ'; si mandás rango ignorará 'day'
 */

const ENTITY = 'Movimiento';

export async function getAll({page, pageSize, payment_id = '', kind_id = '', state_id = '', day = '', dateFrom = '', dateTo = '', } = {}) {
    const ds = await getDataSource();
    const repo = ds.getRepository(EntitySchema);

    const qb = repo
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.payment', 'p')
        .where('1=1');

    const pay_id = Number(payment_id);
    if (pay_id)
        qb.andWhere('s.payment_id = :pay', { pay: pay_id });

    const kindVals = parseEnumFilterOrFail(kind_id, 'kind', SALE_KIND_VALUES);
    if (kindVals.length === 1) {
        qb.andWhere('s.kind = :kind', { kind: kindVals[0] });
    } else if (kindVals.length > 1) {
        qb.andWhere('s.kind IN (:...kinds)', { kinds: kindVals });
    }

    const stateVals = parseEnumFilterOrFail(state_id, 'state', SALE_STATE_VALUES);
    if (stateVals.length === 1) {
        qb.andWhere('s.state = :state', { state: stateVals[0] });
    } else if (stateVals.length > 1) {
        qb.andWhere('s.state IN (:...states)', { states: stateVals });
    }

    const dayTrim = day?.trim();
    const fromTrim = dateFrom?.trim();
    const toTrim = dateTo?.trim();

    if (fromTrim || toTrim) {
        if (!fromTrim || !toTrim)
            throw new BadRequestError('Para filtrar por rango de fechas, debe enviar Fecha Desde y Fecha Hasta.');
        if (dayTrim)
            throw new BadRequestError('No puede combinar un Dia en particular con Fecha Desde/Fecha Hasta.');

        const fromOk = ensureIsoDateOrFail(fromTrim, 'dateFrom');
        const toOk = ensureIsoDateOrFail(toTrim, 'dateTo');

        if (new Date(fromOk) > new Date(toOk))
            throw new BadRequestError('"Fecha Desde" no puede ser mayor que "Fecha Hasta".');

        qb.andWhere('s.date >= :from AND s.date <= :to', { from: fromOk, to: toOk });
    } else if (dayTrim) {
        ensureIsoDateOrFail(dayTrim, 'day');
        qb.andWhere("(s.date AT TIME ZONE 'America/Argentina/Cordoba')::date = :day", { day: dayTrim });
    }

    const total = await qb.clone().getCount();
    const wantsAll = pageSize === 'all';

    const effectivePage = wantsAll ? 1 : (page ? Number(page) : 1);
    if (!Number.isInteger(effectivePage) || effectivePage <= 0)
        throw new BadRequestError(Messages.ERROR.NUMBER_POSITIVE("Nro Pagina"));

    const effectivePageSize = wantsAll ? total : (!pageSize ? 20 : Number(pageSize));
    if (!Number.isInteger(effectivePageSize) || effectivePageSize < 0)
        throw new BadRequestError(Messages.ERROR.NUMBER_POSITIVE("Tamaño de pagina"));

    qb.orderBy('s.date', 'DESC').addOrderBy('s.id', 'DESC');
    if (!wantsAll)
        qb.take(effectivePageSize).skip((effectivePage - 1) * effectivePageSize);

    const items = await qb.getMany();
    items.forEach(item => {
        if (item.payment){
            item.payment_id = item.payment.id;
            item.payment_name = item.payment.name;
            delete item.payment;
        };

        if (item?.kind){
            item.kind_id = item.kind; 
            item.kind_name = SaleKind[item.kind] ?? 'Desconocido';
            delete item.kind;
        };

        if (item?.state){
            item.state_id = item.state; 
            item.state_name = SaleState[item.state] ?? 'Desconocido';
            delete item.state;
        };

        item.date = new Date(item.date).toISOString();
    });

    return {
        items,
        total,
        page: effectivePage,
        pageSize: effectivePageSize,
        pages: Math.ceil(total / (effectivePageSize || 1)),
    };
};

export async function getById(id) {
    const saleId = Number(id);
    if (!Number.isInteger(saleId) || saleId <= 0)
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(`Id del ${ENTITY}`));

    const ds = await getDataSource();
    const repo = ds.getRepository(EntitySchema);  

    const sale = await repo.findOne({
        where: { id: saleId },
        relations: { payment: true, items: { product: true }, },
    });

    if (!sale) 
        throw new NotFoundError(Messages.ERROR.NOT_FOUND(ENTITY));

    if (sale?.payment) {
        sale.payment_id = sale.payment.id;
        sale.payment_name = sale.payment.name;
        delete sale.payment;
    };

    if (sale?.kind){
        sale.kind_id = sale.kind; 
        sale.kind_name = SaleKind[sale.kind] ?? 'Desconocido';
        delete sale.kind;
    };

    if (sale?.state){
        sale.state_id = sale.state; 
        sale.state_name = SaleState[sale.state] ?? 'Desconocido';
        delete sale.state;
    };

    sale.date = new Date(sale.date).toISOString();

    return sale;
};

export async function createNew(payload) {
    const ds = await getDataSource();

    return await ds.transaction(async (em) => {
        const ctx = { em, payload };
        await saleChain(ctx);  // 🔗 Chain of Responsibility
        return ctx.result;
    });
};