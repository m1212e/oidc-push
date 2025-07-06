import { configPrivate } from '$config/private';

export function sendToNtfyTopic({
	body,
	topic,
	title
}: {
	topic: string;
	body: string;
	title: string;
}) {
	fetch(`${configPrivate.NTFY_HOST}/${topic}`, {
		method: 'POST',
		body,
		headers: {
			Title: title
			// Priority: 'urgent',
			// Tags: 'warning,skull'
		}
	});
}
