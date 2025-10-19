import { toEnumOrFail } from '../helper/toEnumOrFail.js';
import { SALE_KIND_VALUES, SALE_STATE_VALUES } from '../../../../shared/enums.js';
import { makeOperation } from '../../service/operationFactory.js';

export async function ParseEnumsHandler(ctx, next) {
    const { kind_id, state_id } = ctx.payload;

    const kindInt  = toEnumOrFail(kind_id, 'kind',  SALE_KIND_VALUES);
    const stateInt = toEnumOrFail(state_id, 'state', SALE_STATE_VALUES);

    ctx.kindInt = kindInt;
    ctx.stateInt = stateInt;
    ctx.op = makeOperation(kindInt);
    await next();
}
