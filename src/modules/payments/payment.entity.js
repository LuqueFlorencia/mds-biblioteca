import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'Payment',
    tableName: 'payment',

    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 50, unique: true },
        is_deleted: { type: Boolean, default: false },
    },

    relations: {
        sales: { 
            type: 'one-to-many', 
            target: 'Sale', 
            inverseSide: 'payment' 
        }
    }
});