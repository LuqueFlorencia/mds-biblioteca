import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'UnitMeasure',
    tableName: 'unit_measure',

    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 50, unique: true },
        description: { type: String, length: 100 },
        is_deleted: { type: Boolean, default: false },
    },
    
    relations: {
        products: { 
            type: 'one-to-many', 
            target: 'Product', 
            inverseSide: 'unit_measure' 
        },
    },
});