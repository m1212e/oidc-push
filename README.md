# oidc-push

Converts E-Mails from your services to ntfy push notifications!

## How does it work?

- oidc-push hosts an SMTP server and a webserver
- On the web interface, a user can login via OIDC
- They can generate a secure random string which will be used as a ntfy topic. Additionally, there is some guidance on how ntfy can be installed and used so people unfamiliar with ntfy can use this themselves
- When the SMTP server receives an E-Mail, the recipient E-Mail is matched against registered users
- When a match is found and the user has registered a ntfy topic, the email will be forwarded to that ntfy topic, which in turn allows any device of the user to get that message as a push notification

> By ensuring any service that sends out E-Mail notifications and oidc-push use the same OIDC provider, you can automatically map E-Mails to push notifications

What a logged in user sees:
![Screenshot of the web app](./screenshots/1.png?raw=true 'Screenshot of the web app')

## How to deploy?

Please see the [example docker compose file](./example/docker-compose.yml) for a more in depth example and more explanation. See the [config dir](./src/lib/config/) for all available config options.

```yml
oidc-push:
  image: m1212e/oidc-push
  environment:
    # where to connect to postgres
    DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
    # oidc issuer openid configuration
    PUBLIC_OIDC_AUTHORITY: http://localhost:8080/default/.well-known/openid-configuration
    # the client to use with that issuer
    PUBLIC_OIDC_CLIENT_ID: default
  ports:
    - 3000:3000 # web interface, can be exposed publicly
    - 3388:3388 # SMTP server, insecure, should be restricted to trusted network
```

> Beware: The SMTP server is not secured! It will accept all credentials if you even set any and does not enforce any auth or tls. Keep it closed to networks you trust.
