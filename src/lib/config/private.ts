import { env } from '$env/dynamic/private';
import { konfigure } from '@m1212e/konfigure';
import { object } from '@m1212e/konfigure/source/object.js';
import { Type } from '@sinclair/typebox';
import { configPublic } from './public';
import { building } from '$app/environment';

function readConfig() {
	return konfigure({
		delimeter: 'disabled',
		schema: Type.Object({
			/**
			 * Where to reach the database
			 */
			DATABASE_URL: Type.String(),
			/**
			 * In case your OIDC client needs a secret, set it like this
			 */
			OIDC_CLIENT_SECRET: Type.Optional(Type.String()),
			/**
			 * If you would like to change the requested scopes, set this
			 */
			OIDC_SCOPES: Type.Optional(Type.String()),
			/**
			 * Determines in which setting the app runs
			 */
			NODE_ENV: Type.Optional(
				Type.Union([Type.Literal('development'), Type.Literal('production'), Type.Literal('test')])
			),
			/**
			 * Secret which is used for various things throughout the app,
			 * set this if you plan on scaling horizontally
			 */
			SECRET: Type.Optional(Type.String()),
			/**
			 * Port the webserver runs on
			 */
			PORT: Type.Optional(Type.Number()),
			/**
			 * Host the webserver runs on
			 */
			HOST: Type.Optional(Type.String()),
			/**
			 * Port the SMTP server runs on
			 */
			SMTP_PORT: Type.Number({ default: 3388 }),
			/**
			 * Host the SMTP server runs on
			 */
			SMTP_HOST: Type.String({ default: '0.0.0.0' }),
			/**
			 * Where to access the ntfy server, defaults to https://ntfy.sh
			 * If you do not set this, but PUBLIC_NTFY_HOST is set, it will be used
			 */
			NTFY_HOST: Type.Optional(Type.String()),
			/**
			 * The length of the topic, defaults to 65 (ntfy.sh default)
			 */
			TOPIC_LENGTH: Type.Integer({ default: 65, minimum: 30 })
		}),
		sources: [object(env)]
	});
}

export const configPrivate = building
	? ({} as Awaited<ReturnType<typeof readConfig>>)
	: await readConfig();

if (!building) {
	const minAmountOfRandomTopicChars = 30;
	if (
		configPrivate.TOPIC_LENGTH - configPublic.PUBLIC_TOPIC_PREFIX.length <=
		minAmountOfRandomTopicChars
	) {
		throw new Error(
			`Your prefix is too long! Please reduce it by ${minAmountOfRandomTopicChars - (configPrivate.TOPIC_LENGTH - configPublic.PUBLIC_TOPIC_PREFIX.length) + 1} chars!`
		);
	}
}
