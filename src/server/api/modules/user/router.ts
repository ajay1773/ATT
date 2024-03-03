import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addNewUser, getAllUsers, getProjectsForUser } from "./service";
import { addNewUserInputSchema } from "./schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async () => {
    try {
      const allUsers = await getAllUsers();
      return allUsers;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong on server end",
      });
    }
  }),

  addNewUser: protectedProcedure
    .input(addNewUserInputSchema)
    .mutation(async ({ input }) => {
      try {
        const newUser = await addNewUser(input);
        return newUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on server end",
        });
      }
    }),
  getSingleUsersProjects: protectedProcedure
    .input(
      z.object({ id: z.string({ required_error: "User ID is required" }) }),
    )
    .query(async ({ input }) => {
      try {
        const projectsList = await getProjectsForUser({ id: input.id });
        if (projectsList) {
          return projectsList;
        } else {
          return null;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),
});
