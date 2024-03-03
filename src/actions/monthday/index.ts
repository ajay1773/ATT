"use server";

import { Attendance } from "@prisma/client";
import { api } from "~/trpc/server";

type TGetAttendanceAction = {
  date: Date;
};

export async function geAttendanceForDay({ date }: TGetAttendanceAction) {
  const attendanceLog = await api.attendance.getAttendanceOfDay.query({ date });
  return attendanceLog;
}

export async function startDay(startTime: Date) {
  const newRecord = await api.attendance.startDay.mutate({ startTime });
  return newRecord;
}

export async function endDay(endTime: Date, currentRecord: Attendance) {
  const newRecord = await api.attendance.endDay.mutate({
    endTime,
    currentRecord,
  });
  return newRecord;
}
