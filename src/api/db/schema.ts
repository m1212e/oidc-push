import { nanoid } from '../../lib/helpers/nanoid';
import {
	pgTable,
	text,
	timestamp,
	unique,
	pgEnum,
	boolean,
	smallint,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';

const defaultTimestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
};
const defaultIdAndTimestamps = {
	id: text()
		.$defaultFn(() => nanoid())
		.primaryKey()
		.notNull(),
	...defaultTimestamps
};

export const user = pgTable('user', {
	id: text().primaryKey().unique().notNull(),
	...defaultTimestamps,

	// OIDC fields
	email: text().notNull().unique(),
	familyName: text().notNull(),
	givenName: text().notNull(),
	locale: text(),
	preferredUsername: text().notNull()
});

// export const user = pgTable('user', {
// 	id: text().primaryKey().unique().notNull(),
// 	...defaultTimestamps,

// 	// OIDC fields
// 	email: text().notNull().unique(),
// 	familyName: text().notNull(),
// 	givenName: text().notNull(),
// 	locale: text(),
// 	preferredUsername: text().notNull()
// });
