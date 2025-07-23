import { configPrivate } from '$config/private';

export async function sendToNtfyTopic({
	body,
	topic,
	title
}: {
	topic: string;
	body: string;
	title: string;
}) {
	const res = await fetch(`${configPrivate.NTFY_HOST}/${topic}`, {
		method: 'POST',
		body,
		headers: {
			Title: title
			// Priority: 'urgent',
			// Tags: 'warning,skull'
		}
	});

	if (!res.ok) {
		console.error('Failed to send notification:', await res.text());
	}
}
