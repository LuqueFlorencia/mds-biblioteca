import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Person",
    tableName: "person",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250 },
        lastname: { type: String, length: 250 },
        dni: {type: String, length: 9},
        enrollment_librarian: {type: String, length: 100, unique: true, nullable: true, default: null },
        member_id: {type: String, unique: true, nullable: true, default: null },
        role_id: { type: Number },
    },

    relations: {
        role: {
            type: 'many-to-one',
            target: 'Role',
            joinColumn: { name: 'role_id' },
            onDelete: 'RESTRICT',
            nullable: false,
        },
        debt: { 
            type: 'one-to-many', 
            target: 'Debt', 
            inverseSide: 'debt' 
        },
        book: { 
            type: 'one-to-many', 
            target: 'Book', 
            inverseSide: 'book' 
        },
        loanAsMember: { 
            type: 'one-to-many', 
            target: 'Loan', 
            inverseSide: 'member' 
        },
        loanAsLibrarian: { 
            type: 'one-to-many', 
            target: 'Loan', 
            inverseSide: 'librarian' 
        },
    },
});