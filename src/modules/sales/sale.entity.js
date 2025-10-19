import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../../shared/utils/numericTransformer.js';

export default new EntitySchema({
    name: 'Sale',
    tableName: 'sale',

    columns: {
        id: { type: Number, primary: true, generated: true },
        date: { type: 'timestamptz', },
        total: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        kind: { type: 'smallint', default: 1 }, // 1=Venta ~ 2=Compra ~ 3=Ajuste ~ ...
        state: {type: 'smallint', default: 1 }, // 1=Confirmado ~ 2=Pendiente ~ 3=Anulado ~ ...
    },

    relations: {
        payment: {
            type: 'many-to-one',
            target: 'Payment',
            joinColumn: { name: 'payment_id' },
            onDelete: 'RESTRICT',
            nullable: false,
        },
        items: {
            type: 'one-to-many',
            target: 'SaleItem',
            inverseSide: 'sale',
            cascade: true,
        },
    },
});