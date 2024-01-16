import { type z } from "zod";
import { type createFormParser } from "./zodParsers";

export type createFormType = z.infer<typeof createFormParser>;