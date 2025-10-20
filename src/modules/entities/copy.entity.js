import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Copy",
    tableName: "copy",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
    },

    relations: {
        book: {
            type: 'many-to-one',
            target: 'Book',
            joinColumn: { name: 'book_id' },
            onDelete: 'RESTRICT',
            nullable: false,
        },
        loans: { 
            type: 'one-to-many', 
            target: 'Loan', 
            inverseSide: 'copy' 
        },
    },
});