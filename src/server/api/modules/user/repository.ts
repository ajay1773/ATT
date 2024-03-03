import { Prisma, User } from "@prisma/client";
import { db } from "~/server/db";

export const findAllUsers = async <T extends Prisma.UserFindManyArgs>(
  payload: T,
): Promise<User[]> => {
  const data = await db.user.findMany(payload);
  return data;
};

export const createUserRecord = async <T extends Prisma.UserCreateInput>(
  data: T,
): Promise<User> => {
  const newUser = await db.user.create({ data });
  return newUser;
};

export const findSingleUser = async <T extends Prisma.UserFindFirstArgs>(
  payload: T,
): Promise<User | null> => {
  const user = await db.user.findFirst(payload);
  if (user) {
    return user;
  } else {
    return null;
  }
};
