import { type z } from "zod";
import type {
	projectFormParser,
	createFormParser
} from "./zodParsers";

export type createFormType = z.infer<typeof createFormParser>;
export type projectFormType = z.infer<typeof projectFormParser>;