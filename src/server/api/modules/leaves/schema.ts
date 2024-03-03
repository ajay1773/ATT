import { LeaveType, Prisma } from "@prisma/client";
import { z } from "zod";

export const addNewLeaveInputSchema = z.object({
  type: z.nativeEnum(LeaveType),
  applicantId: z.string({ required_error: "Applicant id is required." }),
  description: z.string({ required_error: "Description is required." }),
  peopleToInform: z.array(z.string()),
  forProjects: z.array(z.string()),
  timePeriod: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

const leaveApproversWithUsers =
  Prisma.validator<Prisma.ApproverOnLeavesDefaultArgs>()({
    include: {
      user: true,
    },
  });

const leaveWithApprovers = Prisma.validator<Prisma.LeaveDefaultArgs>()({
  include: {
    approverOnLeaves: {
      include: {
        user: true,
      },
    },
  },
});

export const getUserProjectsInputSchema = z.object({
  id: z.string({ required_error: "User ID is required." }),
});

export type TGetUserProjectsInputSchema = z.infer<
  typeof getUserProjectsInputSchema
>;

export type TLeaveApproversWithUsers = Prisma.ApproverOnLeavesGetPayload<
  typeof leaveApproversWithUsers
>;

export type TLeaveWithApprovers = Prisma.LeaveGetPayload<
  typeof leaveWithApprovers
>;
export type TAddNewLeaveInputSchema = z.infer<typeof addNewLeaveInputSchema>;
