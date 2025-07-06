import { db } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('user');

abilityBuilder.user.allow('read').when(({ oidc }) => {
	if (oidc?.user) {
		return {
			where: { id: oidc.user.sub }
		};
	}
});

schemaBuilder.mutationFields((t) => {
	return {
		todo: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				pubsub.updated(args.id);

				return db.query.user.findFirst(
					query(
						ctx.abilities.user.filter('read', {
							inject: {
								where: {
									id: args.id
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
