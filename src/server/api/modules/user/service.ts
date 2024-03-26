import { Prisma, Project, GlobalSettings, User } from "@prisma/client";
import {
  createUserRecord,
  findAllGlobalSettingsRecords,
  findAllUsers,
  findSingleUser,
  updateGlobalSettings,
  createSingleGlobalSettingsRecord,
} from "./repository";
import {
  TAddNewGlobalSettingsRecord,
  TAddNewUserInputSchema,
  TGetUserProjectsInputSchema,
} from "./schema";

const userWithProjects = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    projects: {
      include: {
        project: true,
      },
    },
  },
});

type UserWithProjects = Prisma.UserGetPayload<typeof userWithProjects>;

export const getAllUsers = async (): Promise<User[]> => {
  const users = await findAllUsers({});
  return users;
};

export const addNewUser = async (
  payload: TAddNewUserInputSchema,
): Promise<User> => {
  const details: Prisma.UserCreateInput = {
    firstName: payload.firstName,
    email: payload.email,
    address: payload.address,
    state: payload.state,
    gender: payload.gender,
    lastName: payload.lastName,
    pincode: parseInt(payload.pincode),
    phoneNo: parseInt(payload.phoneNo),
    roleName: payload.roleName,
    roleGroup: payload.roleGroup,
    password: payload.password,
    dob: payload.dob,
    reportsTo: {
      connect: payload.reportsTo.map((id) => ({ id })),
    },
  };
  const newUser = await createUserRecord(details);
  return newUser;
};

export const getProjectsForUser = async (
  payload: TGetUserProjectsInputSchema,
): Promise<Project[] | null> => {
  const query: Prisma.UserFindFirstArgs = {
    where: {
      id: payload.id,
    },
    include: {
      projects: {
        include: {
          project: true,
        },
      },
    },
  };
  const user = (await findSingleUser(query)) as UserWithProjects;
  if (user) {
    const projects = user.projects.map((_p) => _p.project);
    return projects;
  } else {
    return null;
  }
};

export const getAllGlobalSettingsRecords = async (): Promise<
  GlobalSettings[]
> => {
  return await findAllGlobalSettingsRecords();
};

export const createGlobalSettingsRecord = async (
  payload: TAddNewGlobalSettingsRecord,
): Promise<GlobalSettings> => {
  const values: Prisma.GlobalSettingsCreateInput = {
    longitude: payload.longitude,
    latitude: payload.latitude,
    shiftStartHour: payload.shiftStartTime,
    shiftEndHour: payload.shiftEndTime,
  };
  return await createSingleGlobalSettingsRecord(values);
};

export const updateGlobalSettingsRecord = async (
  payload: TAddNewGlobalSettingsRecord,
): Promise<GlobalSettings> => {
  const values: Prisma.GlobalSettingsUpdateArgs = {
    data: {
      longitude: payload.longitude,
      latitude: payload.latitude,
    },
    where: {
      id: payload.id,
    },
  };
  return await updateGlobalSettings(values);
};
