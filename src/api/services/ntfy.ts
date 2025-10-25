import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';

function encodeRFC2047B(str: string) {
	// Use Buffer in Node; fallback to btoa in browser-like envs
	const base64 = Buffer.from(str, 'utf8').toString('base64');
	return `=?UTF-8?B?${base64}?=`;
}

export async function sendToNtfyTopic({
	body,
	topic,
	title
}: {
	topic: string;
	body: string;
	title: string;
}) {
	const res = await fetch(configPrivate.NTFY_HOST ?? configPublic.PUBLIC_NTFY_HOST, {
		method: 'PUT',
		body: JSON.stringify({ message: body, topic }),
		headers: {
			Title: encodeRFC2047B(title)
			// Priority: 'urgent',
			// Tags: 'warning,skull'
		}
	});

	if (!res.ok) {
		console.error('Failed to send notification:', await res.text());
	}
}
