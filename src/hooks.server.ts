import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { OIDC } from '$api/services/OIDC';
import type { ServerInit } from '@sveltejs/kit';
import { smtpServer } from '$api/services/smtp';
import { dev } from '$app/environment';

export const handle: Handle = sequence(OIDC.handle, ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;

		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	})
);

export const init: ServerInit = async () => {
	process.on('sveltekit:shutdown', async (reason) => {
		smtpServer.close();
	});
};
