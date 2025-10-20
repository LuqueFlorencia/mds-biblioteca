import 'dotenv/config';
import { DataSource } from 'typeorm';
import Book from '../modules/entities/book.entity.js';
import Copy from '../modules/entities/copy.entity.js';
import Debt from '../modules/entities/debt.entity.js';
import Loan from '../modules/entities/loan.entity.js';
import Person from '../modules/entities/person.entity.js';
import Role from '../modules/entities/role.entity.js';

const GLOBAL_KEY = '__typeorm_ds__';

const getBaseOptions = () => ({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [Book, Copy, Debt, Loan, Person, Role],
	synchronize: false,
	logging: process.env.NODE_ENV === 'development',
	ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
	extra: {
		max: Number(process.env.DB_POOL_MAX ?? 1),
		idleTimeoutMillis: Number(process.env.DB_IDLE_MS ?? 3000),
		connectionTimeoutMillis: Number(process.env.DB_CONN_MS ?? 5000),
	},
	migrations: ['src/migrations/*.js'],
});

export const AppDataSource = new DataSource(getBaseOptions());

export async function getDataSource() {
	const g = globalThis;
	if (g[GLOBAL_KEY]?.isInitialized) return g[GLOBAL_KEY];

	const ds = new DataSource(getBaseOptions());
	if (!ds.isInitialized) await ds.initialize();
	g[GLOBAL_KEY] = ds;
	return ds;
};
