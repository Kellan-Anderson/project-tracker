import { projectFormParser } from "~/types/zodParsers";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { forms, projects } from "~/server/db/schema";
import { generateUrlId } from "~/lib/helpers/urlId";

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
			const projectUrlId = `${input.title.split(' ').filter(title => title !== '').join('-')}-${generateUrlId()}`
			const now = new Date()

			await ctx.db.insert(projects).values({
				...input,
				id: `pro-${crypto.randomUUID()}`,
				urlId: projectUrlId,
				assignedTo: ownerId,
				createdAt: now,
				lastUpdated: now,
			});

			if(input.getReceipt) {
				// setup sending email to user
				console.log('will send email')
			}
		})
})