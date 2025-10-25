import { db, schema } from '$api/db/db';
import { abilityBuilder, object, pubsub, query, schemaBuilder } from '$api/rumble';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import { nanoid } from '$lib/helpers/nanoid';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { sendMessage } from '$api/services/sendMessage';

const ref = object({
	table: 'user'
});
const pubs = pubsub({
	table: 'user'
});
query({
	table: 'user'
});

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
						ctx.abilities.user.filter('update').merge({
							where: {
								id: user.sub
							}
						}).sql.where
					);

				pubs.updated(user.sub);

				return db.query.user.findFirst(
					query(
						ctx.abilities.user.filter('read').merge({
							where: {
								id: user.sub
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
						ctx.abilities.user.filter('update').merge({
							where: {
								id: user.sub
							}
						}).sql.where
					);

				pubs.updated(user.sub);

				return db.query.user.findFirst(
					query(
						ctx.abilities.user.filter('read').merge({
							where: {
								id: user.sub
							}
						}).query.single
					)
				);
			}
		}),
		sendTest: t.field({
			type: 'String',
			resolve: async (root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();

				const dbUser = await db.query.user
					.findFirst({
						where: {
							id: user.sub
						}
					})
					.then(assertFindFirstExists);

				if (!dbUser.ntfyTopic) {
					throw new GraphQLError('You need to set a topic first!');
				}

				await sendMessage({
					body: 'Test',
					title: 'Test',
					targetEmail: dbUser!.email
				});

				return 'OK';
			}
		})
	};
});
