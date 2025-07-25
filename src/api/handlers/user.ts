import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import { nanoid } from '$lib/helpers/nanoid';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('user');

abilityBuilder.user.allow(['read', 'update']).when(({ oidc }) => {
	if (oidc?.user) {
		return {
			where: { id: oidc.user.sub }
		};
	}
});

schemaBuilder.mutationFields((t) => {
	return {
		resetTopic: t.drizzleField({
			type: ref,
			resolve: async (query, root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();
				const topicLength =
					configPrivate.TOPIC_LENGTH - configPublic.PUBLIC_TOPIC_PREFIX.length - 1;

				await db
					.update(schema.user)
					.set({
						ntfyTopic: configPublic.PUBLIC_TOPIC_PREFIX + nanoid(topicLength)
					})
					.where(
						ctx.abilities.user.filter('update', {
							inject: {
								where: {
									id: user.sub
								}
							}
						}).sql.where
					);

				pubsub.updated(user.sub);

				return db.query.user.findFirst(
					query(
						ctx.abilities.user.filter('read', {
							inject: {
								where: {
									id: user.sub
								}
							}
						}).query.single
					)
				);
			}
		}),
		removeTopic: t.drizzleField({
			type: ref,
			resolve: async (query, root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();

				await db
					.update(schema.user)
					.set({
						ntfyTopic: null
					})
					.where(
						ctx.abilities.user.filter('update', {
							inject: {
								where: {
									id: user.sub
								}
							}
						}).sql.where
					);

				pubsub.updated(user.sub);

				return db.query.user.findFirst(
					query(
						ctx.abilities.user.filter('read', {
							inject: {
								where: {
									id: user.sub
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
