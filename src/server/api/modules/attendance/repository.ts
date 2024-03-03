import { Attendance, Prisma } from "@prisma/client";
import { db } from "~/server/db";

export const findFirstSingleAttendanceRecord = async <
  T extends Prisma.AttendanceWhereInput,
>(
  where: T,
): Promise<Attendance | null> => {
  const singleRecord = db.attendance.findFirst({ where });
  return singleRecord;
};

export const createAttendanceRecord = async <
  T extends Prisma.AttendanceCreateInput,
>(
  data: T,
): Promise<Attendance> => {
  const createdRecord = await db.attendance.create({ data });
  return createdRecord;
};

export const updateAttendanceRecord = async <
  T extends Prisma.AttendanceUpdateArgs,
>(
  payload: T,
): Promise<Attendance> => {
  const updatedRecord = await db.attendance.update(payload);
  return updatedRecord;
};
