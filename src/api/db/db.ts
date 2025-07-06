import * as schemaInternal from './schema';
import { relations as relationsInternal } from './relations';
import { configPrivate } from '$config/private';
import { makeDrizzleClient } from './drizzle';

export const db = await makeDrizzleClient(configPrivate.DATABASE_URL);
export const schema = schemaInternal;
export const relations = relationsInternal;
