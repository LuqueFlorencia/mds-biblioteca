import { DataSource } from 'typeorm';
import Category from '../modules/categories/category.entity.js';
import Payment from '../modules/payments/payment.entity.js';
import Product from '../modules/products/product.entity.js';
import Sale from '../modules/sales/sale.entity.js';
import SaleItem from '../modules/sales/saleItem.entity.js';
import Supplier from "../modules/suppliers/supplier.entity.js";
import UnitMeasure from '../modules/units/unit.entity.js';
import User from "../modules/auth/user.entity.js";

const GLOBAL_KEY = '__typeorm_ds__';

const getBaseOptions = () => ({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [Category, Payment, Product, Sale, SaleItem, Supplier, UnitMeasure, User],
	synchronize: false,
	logging: process.env.NODE_ENV === 'development',
	ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
	extra: {
		max: Number(process.env.DB_POOL_MAX ?? 1),
		idleTimeoutMillis: Number(process.env.DB_IDLE_MS ?? 3000),
		connectionTimeoutMillis: Number(process.env.DB_CONN_MS ?? 5000),
	},
});

export async function getDataSource() {
	const g = globalThis;
	if (g[GLOBAL_KEY]?.isInitialized) return g[GLOBAL_KEY];

	const ds = new DataSource(getBaseOptions());
	if (!ds.isInitialized) await ds.initialize();
	g[GLOBAL_KEY] = ds;
	return ds;
};
