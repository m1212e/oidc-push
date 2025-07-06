import { relations } from './relations';

export async function makeDrizzleClient(dbUrl: string) {
	const drizzleArgs = [
		dbUrl,
		{
			relations,
			casing: 'snake_case'
		}
	] as const;

	if (process.versions.bun) {
		console.info('Detected Bun runtime, using native bun sql driver');
		return (await import('drizzle-orm/bun-sql')).drizzle(...drizzleArgs);
	} else {
		console.info('Did not detect Bun runtime, using node-postgres driver');
		return (await import('drizzle-orm/node-postgres')).drizzle(...drizzleArgs);
	}
}
