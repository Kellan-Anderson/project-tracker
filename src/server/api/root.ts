import { createTRPCRouter } from "~/server/api/trpc";
import { formsRouter } from "./routers/forms";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  forms: formsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
