import { Leave, Prisma, User } from "@prisma/client";
import { db } from "~/server/db";

export const findManyLeaves = async <T extends Prisma.LeaveFindManyArgs>(
  payload: T,
): Promise<Leave[]> => {
  const data = await db.leave.findMany(payload);
  return data;
};

export const createLeaveRecord = async <T extends Prisma.LeaveCreateInput>(
  data: T,
): Promise<Leave> => {
  const newLeave = await db.leave.create({ data });
  return newLeave;
};

export const findSingleLeave = async <T extends Prisma.LeaveFindFirstArgs>(
  payload: T,
): Promise<Leave | null> => {
  const leave = await db.leave.findFirst(payload);
  if (leave) {
    return leave;
  } else {
    return null;
  }
};
