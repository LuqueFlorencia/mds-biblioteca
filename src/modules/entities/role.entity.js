import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Role",
    tableName: "role",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250 },
        description: { type: String, length: 250, nullable: true },
        is_deleted: { type: Boolean, default: false },
    },

    relations: {
        people: { 
            type: 'one-to-many', 
            target: 'Person', 
            inverseSide: 'role' 
        },
    },
});