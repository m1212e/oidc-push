import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';

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
			Title: encodeURIComponent(title)
			// Priority: 'urgent',
			// Tags: 'warning,skull'
		}
	});

	if (!res.ok) {
		console.error('Failed to send notification:', await res.text());
	}
}
