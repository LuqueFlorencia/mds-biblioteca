import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Book",
    tableName: "book",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        isbn: { type: String, length: 250, unique: true },
        title: { type: String, length: 250 },
        author: {type: String, length: 250 },
    },

    relations: {
        copies: { 
            type: 'one-to-many', 
            target: 'Copy', 
            inverseSide: 'book' 
        },
    },
});