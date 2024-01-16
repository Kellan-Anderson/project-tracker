import { createTRPCRouter, protectedProcedure } from "../trpc";
import { forms } from "~/server/db/schema";
import { generateUrlId } from "~/lib/helpers/urlId";
import { createFormParser } from "~/types/zodParsers";

export const formsRouter = createTRPCRouter({
	createForm: protectedProcedure
		.input(createFormParser)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const urlTitle = input.title.split(" ").filter(str => str !== '').join('-')

			await ctx.db.insert(forms).values({
				id: `form-${crypto.randomUUID()}`,
				owner: userId,
				title: input.title,
				urlId: `${urlTitle}-${generateUrlId()}`,
				description: input.description
			})
		})
})