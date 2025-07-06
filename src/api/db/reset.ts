import * as schema from './schema';
import { reset } from 'drizzle-seed';
import { makeDrizzleClient } from './drizzle';

const db = await makeDrizzleClient(process.env.DATABASE_URL!);

console.info('Resetting database...');
await reset(db, schema);
console.info('Resetting database done.');
