import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "~/env";
import * as schema from "./schema";
import postgres from "postgres";

export const db = drizzle(
  postgres(env.DATABASE_URL),
  { schema }
);