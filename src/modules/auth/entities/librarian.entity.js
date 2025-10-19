import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Librarian",
    tableName: "libriarians",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250 },
        lastname: { type: String, length: 250 },
        enrollment: {type: String, length: 100, unique: true},
    }
});