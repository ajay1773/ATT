import moment from "moment";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const holidayRouter = createTRPCRouter({
    getHolidayForSpecificMonth: protectedProcedure
    .input(z.object({date: z.date()}))
    .query(async ({ctx, input})=>{
        try {
            const { date } = input
            const momentDate = moment(date)
            const startOfMonth = momentDate.startOf('month').toDate()
            const endOfMonth = momentDate.endOf('month').toDate()
            const holidays = await ctx.db.holidays.findMany({
                where:{
                    date:{
                        lte:endOfMonth,
                        gte:startOfMonth
                    }
                }
            })
            return holidays
        } catch (error) {
            console.log(error)
        }
    })
})