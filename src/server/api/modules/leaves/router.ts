import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addNewLeaveRecord, getUsersLeaves } from "./service";
import { addNewLeaveInputSchema } from "./schema";
import { TRPCError } from "@trpc/server";
import { getSession } from "next-auth/react";

export const leavesRouter = createTRPCRouter({
  applyNewLeave: protectedProcedure
    .input(addNewLeaveInputSchema)
    .mutation(async ({ input }) => {
      try {
        const leave = await addNewLeaveRecord(input);
        return leave;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong on server end",
        });
      }
    }),
  getLeavesForUser: protectedProcedure.query(async () => {
    const session = await getSession();
    const leaves = await getUsersLeaves(session?.user.id as string);
    return leaves;
  }),
});
