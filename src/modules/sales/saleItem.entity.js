import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../../shared/utils/numericTransformer.js';

export default new EntitySchema({
    name: 'SaleItem',
    tableName: 'sale_item',

    columns: {
        sale_id: { type: Number, primary: true },
        product_id: { type: Number, primary: true },
        quantity: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        unit_price: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        subtotal: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
    },

    relations: {
        sale: {
            type: 'many-to-one',
            target: 'Sale',
            joinColumn: { name: 'sale_id', referencedColumnName: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        product: {
            type: 'many-to-one',
            target: 'Product',
            joinColumn: { name: 'product_id', referencedColumnName: "id" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE"
        },
    },
});