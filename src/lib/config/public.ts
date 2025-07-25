import { building } from '$app/environment';
import { env } from '$env/dynamic/public';
import { konfigure } from '@m1212e/konfigure';
import { object } from '@m1212e/konfigure/source/object.js';
import { Type } from '@sinclair/typebox';

function readConfig() {
	return konfigure({
		delimeter: 'disabled',
		schema: Type.Object({
			PUBLIC_VERSION: Type.Optional(Type.String()),
			PUBLIC_SHA: Type.Optional(Type.String()),
			PUBLIC_OIDC_AUTHORITY: Type.String(),
			PUBLIC_OIDC_CLIENT_ID: Type.String(),
			PUBLIC_DEFAULT_LOCALE: Type.String({ default: 'en' }),
			PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: Type.Optional(Type.String()),
			PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: Type.Optional(Type.String()),
			PUBLIC_NTFY_HOST: Type.String({ default: 'https://ntfy.sh' }),
			PUBLIC_TOPIC_PREFIX: Type.String({ default: '' })
		}),
		sources: [object(env)]
	});
}

export const configPublic = building
	? ({} as Awaited<ReturnType<typeof readConfig>>)
	: await readConfig();
