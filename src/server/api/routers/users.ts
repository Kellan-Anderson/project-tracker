import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { forms, projectsAndUsers, users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
	getFormsAndProjects: protectedProcedure
		.query(async ({ ctx }) => {
			const uid = ctx.session.user.id;
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.id, uid),
				with: {
					forms: {
						where: eq(forms.owner, uid)
					},
					projectsToUsers: {
						with: {
							project: true
						},
						where: eq(projectsAndUsers.userId, uid)
					}
				}
			});

			if(!user)
				throw new Error('There was an issue while trying to retrieve the user')

			const userForms = user.forms.map(({ description, title, urlId }) => ({
				description: description ?? undefined,
				title,
				urlId,
			}));
			const userProjects = user.projectsToUsers.map(p => {
				const project = p.project;
				const { createdAt, description, email, id, lastUpdated, title, urlId, username } = project;
				return { createdAt, description, email, id, lastUpdated, title, urlId, username }
			});
			return {
				forms: userForms,
				projects: userProjects,
			}
		})
})