import { Prisma, GlobalSettings, User } from "@prisma/client";
import { db } from "~/server/db";

export const findAllUsers = async <T extends Prisma.UserFindManyArgs = {}>(
  payload: T = {} as T,
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

export const findAllGlobalSettingsRecords = async <
  T extends Prisma.GlobalSettingsFindManyArgs = {},
>(
  payload: T = {} as T,
): Promise<GlobalSettings[]> => {
  const data = await db.globalSettings.findMany(payload);
  return data;
};

export const createSingleGlobalSettingsRecord = async <
  T extends Prisma.GlobalSettingsCreateInput,
>(
  data: T,
): Promise<GlobalSettings> => {
  const newCoordinates = await db.globalSettings.create({
    data,
  });
  return newCoordinates;
};

export const updateGlobalSettings = async <
  T extends Prisma.GlobalSettingsUpdateArgs,
>(
  payload: T,
) => {
  const updatedData = await db.globalSettings.update(payload);
  return updatedData;
};
