import { chainHandlers } from '../../../../core/chain/chain.js';
import { ValidatePayloadHandler } from './01.ValidatePayloadHandler.js';
import { ParseEnumsHandler } from './02.ParseEnumsHandler.js';
import { EnsurePaymentHandler } from './03.EnsurePaymentHandler.js';
import { AggregateItemsHandler } from './04.AggregateItemsHandler.js';
import { LoadProductsLockHandler } from './05.LoadProductsLockHandler.js';
import { BuildStockDeltasHandler } from './06.BuildStockDeltasHandler.js';
import { ValidateStockHandler } from './07.ValidateStockHandler.js';
import { BuildSaleItemsHandler } from './08.BuildSaleItemsHandler.js';
import { PersistSaleHandler } from './09.PersistSaleHandler.js';
import { UpdateStockHandler } from './10.UpdateStockHandler.js';
import { HydrateResultHandler } from './11.HydrateResultHandler.js';

export const saleChain = chainHandlers([
    ValidatePayloadHandler,
    ParseEnumsHandler,
    EnsurePaymentHandler,
    AggregateItemsHandler,
    LoadProductsLockHandler,
    BuildStockDeltasHandler,
    ValidateStockHandler,
    BuildSaleItemsHandler,
    PersistSaleHandler,
    UpdateStockHandler,
    HydrateResultHandler,
]);