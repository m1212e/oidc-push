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
		SECRET: Type.Optional(Type.String())
	}),
	sources: [
		sources.object(env),
		sources.dockerSecrets(),
		sources.yamlFile('./config.yaml'),
		sources.tomlFile('./config.toml'),
		sources.jsonFile('./config.json')
	]
});
