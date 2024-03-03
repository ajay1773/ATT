import { Prisma, Project } from "@prisma/client";
import { db } from "~/server/db";

export const findAllProjects = async <
  T extends Prisma.ProjectFindManyArgs = {},
>(
  payload: T = {} as T,
): Promise<Project[]> => {
  const data = await db.project.findMany(payload);
  return data;
};
