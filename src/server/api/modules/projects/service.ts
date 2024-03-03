import { Prisma, Project } from "@prisma/client";
import { findAllProjects } from "./repository";

export const getManyProjects = async (): Promise<Project[]> => {
  const projects = await findAllProjects({});
  return projects;
};
