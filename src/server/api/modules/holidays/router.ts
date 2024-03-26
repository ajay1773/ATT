import moment from "moment";
import path from "path";
import { z } from "zod";
import fs from "fs-extra";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getHolidaysForTimePeriod,
  getLeavesAndHolidaysCombinedForTimePeriod,
  uploadHolidaysFile,
} from "./service";

export const holidayRouter = createTRPCRouter({
  getHolidayForSpecificMonth: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      try {
        const { date } = input;
        const momentDate = moment(date);
        const startOfMonth = momentDate.startOf("month").toDate();
        const endOfMonth = momentDate.endOf("month").toDate();
        const holidays = await ctx.db.holidays.findMany({
          where: {
            date: {
              lte: endOfMonth,
              gte: startOfMonth,
            },
          },
        });
        return holidays;
      } catch (error) {
        console.log(error);
      }
    }),
  uploadPublicHolidaysCSV: protectedProcedure
    .input(z.object({ byte64ArrayString: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await uploadHolidaysFile(input.byte64ArrayString);
        return input.byte64ArrayString;
      } catch (error) {
        console.log(error);
      }
    }),
  getHolidaysForTimePeriod: protectedProcedure
    .input(z.object({ startTime: z.date(), endTime: z.date() }))
    .query(async ({ input }) => {
      try {
        const holidays = await getHolidaysForTimePeriod({
          startTime: input.startTime,
          endTime: input.endTime,
        });
        return holidays;
      } catch (error) {
        console.log(error);
      }
    }),
  getHolidaysAndLeavesForTimePeriod: protectedProcedure
    .input(z.object({ startTime: z.date(), endTime: z.date() }))
    .query(async ({ input }) => {
      try {
        const dayDetails = await getLeavesAndHolidaysCombinedForTimePeriod({
          startTime: input.startTime,
          endTime: input.endTime,
        });
        return dayDetails;
      } catch (error) {
        console.log(error);
      }
    }),
});
