import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { getManyProjects } from "./service";

export const projectsRouter = createTRPCRouter({
  getAllProjects: protectedProcedure.query(async () => {
    try {
      const projects = await getManyProjects();
      return projects;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong!",
      });
    }
  }),
});
