import { Attendance, Prisma } from "@prisma/client";
import {
  createAttendanceRecord,
  findFirstSingleAttendanceRecord,
  updateAttendanceRecord,
} from "./repository";
import moment from "moment";

export const getSingleAttendanceRecordByDate = async ({
  date,
}: {
  date: Date;
}): Promise<Attendance | null> => {
  type TSingleAttendanceRecordByStartAndEndDateQuery = {
    date: {
      gte: Date;
      lte: Date;
    };
  };

  const startDate = moment(date).startOf("day").toDate(); // Start of the provided date
  const endDate = moment(date).add(1, "day").startOf("day").toDate();
  return await findFirstSingleAttendanceRecord<TSingleAttendanceRecordByStartAndEndDateQuery>(
    {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  );
};

/**
 *
 * @param startTime Date
 * @param userId string
 * @returns Promise
 */
export const startDayForUser = async (startTime: Date, userId: string) => {
  const startDate = moment(startTime).startOf("day").toDate();

  const payload: Prisma.AttendanceCreateInput = {
    startTime,
    date: startDate,
    isSubmitted: false,
    user: {
      connect: {
        id: userId,
      },
    },
  };

  const newRecord = await createAttendanceRecord(payload);
  return newRecord;
};

/**
 *
 * @param endTime Date
 * @param userId String
 * @param currentRecord Attendance
 * @returns Promise<Attendance>
 */
export const endDayForUser = async (
  endTime: Date,
  userId: string,
  currentRecord: Attendance,
) => {
  const payload: Prisma.AttendanceUpdateArgs = {
    where: {
      id: currentRecord.id,
      userId,
    },
    data: {
      ...currentRecord,
      endTime,
      isSubmitted: true,
    },
  };

  const updatedRecord = await updateAttendanceRecord(payload);
  return updatedRecord;
};
