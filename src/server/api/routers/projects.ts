import { projectFormParser } from "~/types/zodParsers";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { forms, projects, projectsAndUsers } from "~/server/db/schema";
import { generateUrlId } from "~/lib/helpers/urlId";
import { Resend } from "resend"
import { env } from "~/env";
import { FormReceipt } from "~/emails/formReceipt";

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
					react: FormReceipt({ ...input })
				});
			}
		})
})