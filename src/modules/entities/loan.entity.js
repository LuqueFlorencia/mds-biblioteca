import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Loan",
    tableName: "loan",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        date_from: { type: 'timestamptz' },
        date_to: { type: 'timestamptz' },
        returned_at: { type: 'timestamptz', nullable: true, default: null },
    },

    relations: {
        librarian: {
            type: 'many-to-one',
            target: 'Person',
            joinColumn: { name: 'librarian_id' },
            onDelete: 'SET NULL',
            nullable: true,
            default: null,
        },
        member: {
            type: 'many-to-one',
            target: 'Person',
            joinColumn: { name: 'member_id' },
            onDelete: 'RESTRICT',
            nullable: false,
            default: null,
        },
        copy: {
            type: 'many-to-one',
            target: 'Copy',
            joinColumn: { name: 'copy_id' },
            onDelete: 'RESTRICT',
            nullable: false,
            default: null,
        },
        debts: { 
            type: 'one-to-many', 
            target: 'Debt', 
            inverseSide: 'loan' 
        },
    },
});