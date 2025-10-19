import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../../shared/utils/numericTransformer.js';

export default new EntitySchema({
    name: 'Product',
    tableName: 'product',

    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, lenght: 50 },
        description: { type: String, length: 250, nullable: true, default: null },
        price: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        stock: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        is_deleted: { type: Boolean, default: false },
    },

    relations: {
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: { name: 'category_id' },
            onDelete: 'SET NULL',
            nullable: true,
            default: null,
        },
        unit: {
            type: 'many-to-one',
            target: 'UnitMeasure',
            joinColumn: { name: 'unit_id' },
            onDelete: 'SET NULL',
            nullable: true,
            default: null,
        },
        saleItems: { 
            type: 'one-to-many', 
            target: 'SaleItem', 
            inverseSide: 'product' 
        }
    },
});