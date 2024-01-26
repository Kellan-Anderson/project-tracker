import { projectFormParser, projectStatusParser } from "~/types/zodParsers";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { forms, projects, projectsAndUsers, updates } from "~/server/db/schema";
import { generateUrlId } from "~/lib/helpers/urlId";
import { Resend } from "resend"
import { env } from "~/env";
import { FormReceipt } from "~/emails/formReceipt";
import { ProjectNotification } from "~/emails/projectNotification";
import { checkPermission } from "~/lib/helpers/projectPermission";

export const projectsRouter = createTRPCRouter({
	postProject: publicProcedure
		.input(projectFormParser.merge(z.object({ formUrl: z.string() })))
		.mutation(async ({ ctx, input }) => {
			const form = await ctx.db.query.forms.findFirst({
				where: eq(forms.urlId, input.formUrl),
				with: {
					owner: true
				}
			});

			if(!form) 
				throw new Error('Could not find the correct form');

			const ownerId = form.owner.id;
			const projectId = `pro-${crypto.randomUUID()}`
			const projectUrlId = `${input.title.split(' ').filter(title => title !== '').join('-')}-${generateUrlId()}`
			const now = new Date()

			await ctx.db.insert(projects).values({
				...input,
				id: projectId,
				urlId: projectUrlId,
				createdAt: now,
				lastUpdated: now,
			});

			await ctx.db.insert(projectsAndUsers).values({
				projectId,
				userId: ownerId,
				permission: 'owner'
			})

			if(input.getReceipt) {
				const resend = new Resend(env.RESEND_API_KEY);
				const { error } = await resend.emails.send({
					from: 'Projects - Do not reply <onboarding@resend.dev>',
					subject: `Receipt for ${input.title}`,
					to: input.email,
					react: FormReceipt({ ...input })
				});
				if(error) {
					console.log({ emailError: error });
					throw new Error('There was an issue sending the receipt email')
				}
			}

			if(ctx.session?.user.email) {
				const resend = new Resend(env.RESEND_API_KEY);
				const { error } = await resend.emails.send({
					from: 'Project submission - Do not reply <onboarding@resend.dev>',
					subject: `${input.title} notification`,
					to: ctx.session?.user.email,
					react: ProjectNotification({ ...input, formName: form.title })
				});
				if(error) {
					console.log({ emailError: error });
					throw new Error('There was an issue sending the receipt email')
				}
			}
		}),

	getProjectByUrl: protectedProcedure
		.input(z.object({ projectUrl: z.string() }))
		.query(async ({ ctx, input }) => {
			const project = await ctx.db.query.projects.findFirst({ where: eq(projects.urlId, input.projectUrl) });
			if(!project)
				throw new Error('Could not find that project');
			const permission = await ctx.db.query.projectsAndUsers.findFirst({ where: and(
				eq(projectsAndUsers.projectId, project.id),
				eq(projectsAndUsers.userId, ctx.session.user.id),
			)})
			if(!permission)
				throw new Error('You do not have access to view this project')
			return {
				project,
				permission: permission.permission
			}
		}),

	updateProjectStatus: protectedProcedure
		.input(z.object({
			newStatus: projectStatusParser,
			projectId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const verification = await ctx.db.query.projectsAndUsers.findFirst({ where: and(
				eq(projectsAndUsers.projectId, input.projectId),
				eq(projectsAndUsers.userId, ctx.session.user.id)
			)});
			if(!verification) 
				throw new Error('There was an issue retrieving the project permission');
			if(verification.permission === 'viewer')
				throw new Error('You do ont have permission to update this project');
			await ctx.db.update(projects).set({ status: input.newStatus })
		}),

		updateTitle: protectedProcedure
			.input(z.object({
				title: z.string(),
				projectId: z.string()
			}))
			.mutation(async ({ ctx, input }) => {
				const allowed = await checkPermission({
					userId: ctx.session.user.id,
					projectId: input.projectId,
					isNot: 'viewer'
				})
				if(!allowed)
					throw new Error('You do not have access to this project')

				await Promise.all([
					ctx.db
						.update(projects)
						.set({
							title: input.title,
							lastUpdated: new Date()
						})
						.where(eq(projects.id, input.projectId)),
					ctx.db
						.insert(updates)
						.values({
							authorId: ctx.session.user.id,
							id: `update-${crypto.randomUUID()}`,
							projectId: input.projectId,
							title: `${ctx.session.user.name} change the project name to ${input.title}`
						})
				])
			})
})