import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { projects, projectsAndUsers, updates } from "~/server/db/schema";

export const updatesRouter = createTRPCRouter({
	getUpdatesByProjectId: protectedProcedure
		.input(z.object({
			projectId: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const projectRef = await ctx.db.query.projectsAndUsers.findFirst({
				where: getProjectVerification(ctx.session.user.id, input.projectId)
			});
			if(!projectRef)
				throw new Error('Could not find that project or you do not have access to this project')
			const projectUpdates = await ctx.db.query.updates.findMany({ where: eq(updates.projectId, input.projectId) });
			return projectUpdates;
		}),

	addUpdate: protectedProcedure
		.input(z.object({
			title: z.string(),
			notes: z.string().optional(),
			projectId: z.string(),
			notificationType: z.enum(['notifying', 'non-notifying'])
		}))
		.mutation(async ({ ctx, input }) => {
			const userPermission = await ctx.db.query.projectsAndUsers.findFirst({
				where: getProjectVerification(ctx.session.user.id, input.projectId)
			});
			if(!userPermission)
				throw new Error('There was an error while retrieving the project')
			if(userPermission.permission === 'viewer')
				throw new Error('You do not have permission to add an update')
			
			await Promise.all([
				ctx.db.insert(updates).values({
					...input,
					authorId: ctx.session.user.id,
					id: `update-${crypto.randomUUID()}`,
				}),
				ctx.db.update(projects).set({ lastUpdated: new Date() }).where(eq(projects.id, input.projectId))
			])
		}),

	editUpdate: protectedProcedure
		.input(z.object({
			title: z.string(),
			notes: z.string().optional(),
			projectId: z.string(),
			updateId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const projectRef = await ctx.db.query.projectsAndUsers.findFirst({
				where: getProjectVerification(ctx.session.user.id, input.projectId)
			});
			if(!projectRef)
				throw new Error('There was an error while retrieving the update');
			if(projectRef.permission === 'viewer')
				throw new Error('You do not have permission to perform this action');

			await ctx.db.update(updates).set({
				notes: input.notes,
				title: input.title,
				isEdited: true
			}).where(and(eq(updates.id, input.updateId), eq(updates.projectId, input.projectId)))
		})
})

function getProjectVerification(userId: string, projectId: string) {
	return and(
		eq(projectsAndUsers.projectId, projectId),
		eq(projectsAndUsers.userId, userId)
	)
}