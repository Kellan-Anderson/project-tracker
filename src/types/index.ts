import { type z } from "zod";
import type {
	projectFormParser,
	createFormParser,
	localStorageAlertParser
} from "./zodParsers";

// Zod parser types
export type createFormType = z.infer<typeof createFormParser>;
export type projectFormType = z.infer<typeof projectFormParser>;
export type localStorageAlert = z.infer<typeof localStorageAlertParser>;

// Custom types
export type alertType = {
	lsAlert: localStorageAlert,
	navigate?: string
}