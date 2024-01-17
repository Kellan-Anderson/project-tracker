import { z } from "zod";

export const createFormParser = z.object({
	title: z.string().min(1, 'Form title is required'),
	description: z.string().optional()
});

export const projectFormParser = z.object({
	projectName: z.string().min(1, 'Project name is required'),
	projectDescription: z.string().min(1, 'Project description is required'),
	userName: z.string().min(1, 'Name is required'),
	userEmail: z.string().email('Please enter a valid email'),
	receiveUpdates: z.boolean(),
	getReceipt: z.boolean(),
	requiresApproval: z.boolean(),
})