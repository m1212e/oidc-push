import { configPrivate } from '$config/private';
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';

// You can send an example mail with
// msmtp --host=localhost --port=3388 --auth=off --tls=off --from=sender@example.com recipient@example.com < dev-example-mail.txt

export const smtpServer = new SMTPServer({
	authOptional: true,
	onData(stream, session, cb) {
		stream.on('end', () => cb(null));
		simpleParser(stream, (err, parsed) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(parsed);
			console.log('to', parsed.to.text);
			console.log('subject', parsed.subject);
			console.log('text', parsed.text);
		});
	}
});

smtpServer.on('error', (err) => {
	console.error('SMTP Server error:', err.message);
});

smtpServer.listen(configPrivate.SMTP_PORT, configPrivate.SMTP_HOST);

console.info(`SMTP server listening on ${configPrivate.SMTP_HOST}:${configPrivate.SMTP_PORT}`);
