import { Holidays, Prisma } from "@prisma/client";
import { db } from "~/server/db";

export const createMultipleHolidayRecords = async (args: {
  data: Prisma.HolidaysCreateManyInput | Prisma.HolidaysCreateManyInput[];
}): Promise<Prisma.BatchPayload> => {
  const newRecords = await db.holidays.createMany(args);
  return newRecords;
};

export const findAllHolidays = async <T extends Prisma.HolidaysFindManyArgs>(
  payload: T,
): Promise<Holidays[]> => {
  const data = await db.holidays.findMany(payload);
  return data;
};
