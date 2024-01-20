import { z } from "zod";

export const createFormParser = z.object({
	title: z.string().min(1, 'Form title is required'),
	description: z.string().optional()
});

export const projectFormParser = z.object({
	title: z.string().min(1, 'Project name is required'),
	description: z.string().min(1, 'Project description is required'),
	username: z.string().min(1, 'Name is required'),
	email: z.string().email('Please enter a valid email'),
	receiveUpdates: z.boolean(),
	getReceipt: z.boolean(),
	requiresApproval: z.boolean(),
});

export const localStorageAlertParser = z.object({
	alert: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
	severity: z.enum([ 'success', 'error' ])
});

export const projectStatusParser = z.enum(["submitted", "scheduled", "in progress", "awaiting approval", "completed"])