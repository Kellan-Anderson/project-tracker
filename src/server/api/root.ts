import { createTRPCRouter } from "~/server/api/trpc";
import { formsRouter } from "./routers/forms";
import { projectsRouter } from "./routers/projects";
import { usersRouter } from "./routers/users";
import { updatesRouter } from "./routers/updates";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  forms: formsRouter,
  project: projectsRouter,
  user: usersRouter,
  updates: updatesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
