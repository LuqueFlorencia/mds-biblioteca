import { EntitySchema } from 'typeorm';

export default new EntitySchema({
	name: 'Category',
	tableName: 'category',

	columns: {
		id: { type: Number, primary: true, generated: true },
		name: { type: String, lenght: 50, unique: true },
		is_deleted: { type: Boolean, default: false },
	},
	
	relations: {
		products: { 
			type: "one-to-many", 
			target: "Product", 
			inverseSide: "category" 
		}
	}
});
