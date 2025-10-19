import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'Supplier',
    tableName: 'supplier',

    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250, unique: true },
        is_deleted: { type: Boolean, default: false },
    }
});