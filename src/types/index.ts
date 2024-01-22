import { type z } from "zod";
import type {
	projectFormParser,
	createFormParser,
	localStorageAlertParser,
	projectStatusParser,
	permissionsParser
} from "./zodParsers";

// Zod parser types
export type createFormType = z.infer<typeof createFormParser>;
export type projectFormType = z.infer<typeof projectFormParser>;
export type localStorageAlert = z.infer<typeof localStorageAlertParser>;
export type projectStatus = z.infer<typeof projectStatusParser>;
export type permissions = z.infer<typeof permissionsParser>;

// Custom types
export type alertType = {
	lsAlert: localStorageAlert,
	navigate?: string
}