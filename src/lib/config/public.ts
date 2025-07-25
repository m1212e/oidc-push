import { building } from '$app/environment';
import { env } from '$env/dynamic/public';
import { konfigure } from '@m1212e/konfigure';
import { object } from '@m1212e/konfigure/source/object.js';
import { Type } from '@sinclair/typebox';

function readConfig() {
	return konfigure({
		delimeter: 'disabled',
		schema: Type.Object({
			/**
			 * The version of the app
			 */
			PUBLIC_VERSION: Type.Optional(Type.String()),
			/**
			 * The commit hash of the app
			 */
			PUBLIC_SHA: Type.Optional(Type.String()),
			/**
			 * Authority of the OIDC provider
			 */
			PUBLIC_OIDC_AUTHORITY: Type.String(),
			/**
			 * OIDC client to use
			 */
			PUBLIC_OIDC_CLIENT_ID: Type.String(),
			/**
			 * The default locale in case it cannot be determined automatically
			 */
			PUBLIC_DEFAULT_LOCALE: Type.String({ default: 'en' }),
			/**
			 * The route to the login callback
			 */
			PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: Type.Optional(Type.String()),
			/**
			 * The route to the logout callback
			 */
			PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: Type.Optional(Type.String()),
			/**
			 * The host to connect to ntfy. Used for public display to the user. Defaults to https://ntfy.sh
			 * In case you need to display a different ntfy url to the user for them to register in their apps,
			 * e.g. if you run behind a reverse proxy and want to use an internal ntfy host, you can set this
			 * and the NTFY_HOST accordingly
			 */
			PUBLIC_NTFY_HOST: Type.String({ default: 'https://ntfy.sh' }),
			/**
			 * If you want to prefix the generated topics with a string, set it here.
			 * Might be useful to keep track on what the topics are used for
			 */
			PUBLIC_TOPIC_PREFIX: Type.String({ default: '' })
		}),
		sources: [object(env)]
	});
}

export const configPublic = building
	? ({} as Awaited<ReturnType<typeof readConfig>>)
	: await readConfig();
