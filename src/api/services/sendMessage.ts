import { db } from '$api/db/db';
import { sendToNtfyTopic } from './ntfy';

export async function sendMessage({
	body,
	title,
	targetEmail
}: {
	targetEmail?: string;
	body?: string;
	title?: string;
}) {
	if (!title || !body) {
		console.error('Missing title or body for notification', {
			title,
			body,
			targetEmail
		});
		return;
	}

	const foundUser = await db.query.user.findFirst({
		where: {
			email: targetEmail
		}
	});

	if (!foundUser) {
		console.error('Could not find user', targetEmail);
		return;
	}

	if (!foundUser.ntfyTopic) {
		console.error('User did not set up ntfy, discarding notification for', targetEmail);
		return;
	}

	await sendToNtfyTopic({
		body,
		topic: foundUser.ntfyTopic,
		title
	});

	console.info('Sent notification to', foundUser.email, foundUser.ntfyTopic.slice(0, 5) + '...');
}
