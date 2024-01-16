import { z } from "zod";

export const createFormParser = z.object({
	title: z.string().min(1, 'Form title is required'),
	description: z.string().optional()
});