import { Leave, Prisma } from "@prisma/client";
import { createLeaveRecord, findManyLeaves } from "./repository";
import {
  TAddNewLeaveInputSchema,
  TLeaveWithApprovers as LeaveWithApprovers,
} from "./schema";
import { db } from "~/server/db";

export const addNewLeaveRecord = async (
  payload: TAddNewLeaveInputSchema,
): Promise<Leave> => {
  const toBeConnectedProjects: Prisma.ProjectCreateNestedManyWithoutLeavesTakenInput["connect"] =
    payload.forProjects.map((id) => ({ id }));
  const details: Prisma.LeaveCreateInput = {
    type: payload.type,
    description: payload.description,
    from: payload.timePeriod.from,
    to: payload.timePeriod.to,
    applier: {
      connect: {
        id: payload.applicantId,
      },
    },
    appliedForProjects: {
      connect: toBeConnectedProjects,
    },
  };
  const newLeave = await createLeaveRecord(details);
  await db.approverOnLeaves.createMany({
    data: payload.peopleToInform.map((userId) => ({
      userId,
      leaveId: newLeave.id,
    })),
  });

  return newLeave;
};

export const getUsersLeaves = async (
  userID: string,
): Promise<LeaveWithApprovers[]> => {
  const query: Prisma.LeaveFindManyArgs = {
    where: {
      appliedBy: userID,
    },
    include: {
      approverOnLeaves: {
        include: {
          user: true,
        },
      },
    },
  };
  const leaves = (await findManyLeaves(query)) as LeaveWithApprovers[];
  return leaves;
};
