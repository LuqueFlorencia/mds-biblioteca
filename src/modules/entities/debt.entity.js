import { EntitySchema } from 'typeorm';
import { numericTransformer } from '../../shared/utils/numericTransformer.js';

export default new EntitySchema({
    name: "Debt",
    tableName: "debt",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        amount: { type: 'decimal', precision: 10, scale: 2, transformer: numericTransformer },
        paid: { type: Boolean, default: false },
    },

    relations: {
        member: {
            type: 'many-to-one',
            target: 'Person',
            joinColumn: { name: 'member_id' },
            onDelete: 'RESTRICT',
            nullable: false,
        },
        loan: {
            type: 'many-to-one',
            target: 'Loan',
            joinColumn: { name: 'loan_id' },
            onDelete: 'SET NULL',
            nullable: true,
            default: null,
        }
    },
});