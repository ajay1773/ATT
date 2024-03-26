import { LeaveStatus, LeaveType } from "@prisma/client";

export type DayDetails = {
  recordId?: string;
  name?: string;
  date: Date;
  type: "holiday" | "leave";
  leaveType?: LeaveType;
  leaveStatus?: LeaveStatus;
};
