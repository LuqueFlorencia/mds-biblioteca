import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Member",
    tableName: "members",
    
    columns: {
        id: { type: Number, primary: true, generated: true },
        name: { type: String, length: 250 },
        lastname: { type: String, length: 250 },
        member_id: {type: Number, unique: true},
    }
});