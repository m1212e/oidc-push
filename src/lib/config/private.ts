import { env } from '$env/dynamic/private';
import { konfigure, sources } from '@m1212e/konfigure';
import { Type } from '@sinclair/typebox';

export const configPrivate = await konfigure({
	delimeter: 'disabled',
	schema: Type.Object({
		DATABASE_URL: Type.String(),
		OIDC_CLIENT_SECRET: Type.Optional(Type.String()),
		OIDC_SCOPES: Type.Optional(Type.String()),
		NODE_ENV: Type.Optional(
			Type.Union([Type.Literal('development'), Type.Literal('production'), Type.Literal('test')])
		),
		SECRET: Type.Optional(Type.String()),
		PORT: Type.Optional(Type.Number()),
		HOST: Type.Optional(Type.String()),
		SMTP_PORT: Type.Number({ default: 3388 }),
		SMTP_HOST: Type.String({ default: '0.0.0.0' }),
		NTFY_HOST: Type.String()
	}),
	sources: [
		sources.object(env),
		sources.dockerSecrets(),
		sources.yamlFile('./config.yaml'),
		sources.tomlFile('./config.toml'),
		sources.jsonFile('./config.json')
	]
});
