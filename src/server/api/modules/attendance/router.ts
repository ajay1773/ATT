import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import {
  endDayForUser,
  getSingleAttendanceRecordByDate,
  startDayForUser,
} from "./service";

export const attendanceRouter = createTRPCRouter({
  getAttendanceOfDay: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input }) => {
      try {
        const attendance = await getSingleAttendanceRecordByDate({
          date: input.date,
        });
        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: String(error),
        });
      }
    }),

  startDay: protectedProcedure
    .input(z.object({ startTime: z.date() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const newRecord = await startDayForUser(input.startTime, userId);
        return newRecord;
      } catch (error) {
        console.error(error);
      }
    }),

  endDay: protectedProcedure
    .input(
      z.object({
        endTime: z.date(),
        currentRecord: z.object({
          id: z.string(),
          userId: z.string(),
          date: z.date(),
          startTime: z.date(),
          endTime: z.date().nullable(),
          isSubmitted: z.boolean(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const updatedRecord = await endDayForUser(
          input.endTime,
          userId,
          input.currentRecord,
        );
        return updatedRecord;
      } catch (error) {
        console.error(error);
      }
    }),
});
