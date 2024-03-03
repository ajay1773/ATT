import { createTRPCRouter } from "~/server/api/trpc";
import { holidayRouter } from "./modules/holidays/router";
import { attendanceRouter } from "./modules/attendance/router";
import { userRouter } from "./modules/user/router";
import { projectsRouter } from "./modules/projects/router";
import { leavesRouter } from "./modules/leaves/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  holidays: holidayRouter,
  user: userRouter,
  attendance: attendanceRouter,
  project: projectsRouter,
  leaves: leavesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
