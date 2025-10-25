import * as schema from './schema';
import { relations } from './relations';

import { drizzle } from 'drizzle-orm/node-postgres';

export async function makeDrizzleClient(dbUrl: string) {
	const drizzleArgs = [
		dbUrl,
		{
			relations,
			schema,
			casing: 'snake_case'
		}
	] as const;

	const db = drizzle(...drizzleArgs);

	if (process.versions.bun) {
		console.info('Detected Bun runtime, using native bun sql driver');
		return (await import('drizzle-orm/bun-sql')).drizzle(...drizzleArgs) as unknown as typeof db;
	}

	return db;
}
