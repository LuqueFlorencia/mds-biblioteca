import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Author",
    tableName: "authors",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250 },
        lastname: { type: String, length: 250 },
    }
});