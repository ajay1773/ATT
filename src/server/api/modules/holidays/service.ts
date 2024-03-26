import path from "path";
import {
  createBufferFromByteArray,
  ensureFolderExists,
  readCsvFile,
  writeFileToFolder,
} from "~/server/utils/files";
import { THoliday } from "./schema";
import {
  createMultipleHolidayRecords,
  deleteManyFromHolidays,
  findAllHolidays,
} from "./repository";
import moment from "moment";
import { Holidays, Leave, Prisma } from "@prisma/client";
import { getLeavesForTimePeriod } from "../leaves/service";
import { DayDetails } from "~/server/types";

export const uploadHolidaysFile = async (byteArray: string) => {
  const tempFilePath = path.join(__dirname, "temp");
  await ensureFolderExists(tempFilePath);
  const buffer = createBufferFromByteArray(byteArray);
  const writtenCSVFilePath = await writeFileToFolder(buffer, tempFilePath);
  const data = await readCsvFile<THoliday>(writtenCSVFilePath);
  await addCSVRowsToDatabase(data);
};

export const addCSVRowsToDatabase = async (rows: THoliday[]) => {
  if (rows.length) {
    await emptyHolidaysTable();
    await createMultipleHolidayRecords({
      data: rows.map((row) => ({
        name: row.name,
        type: row.type,
        date: moment(row.date).toDate(),
      })),
    });
  }
};

export const getLeavesAndHolidaysCombinedForTimePeriod = async ({
  startTime,
  endTime,
}: {
  startTime: Date;
  endTime: Date;
}) => {
  const leaves = await getLeavesForTimePeriod({
    startTime,
    endTime,
  });

  const holidays = await getHolidaysForTimePeriod({
    startTime,
    endTime,
  });

  return mergeHolidaysAndLeaves(leaves, holidays);
};

export const emptyHolidaysTable = async () => {
  await deleteManyFromHolidays({});
};

export const getHolidaysForTimePeriod = async ({
  startTime,
  endTime,
}: {
  startTime: Date;
  endTime: Date;
}) => {
  const query: Prisma.HolidaysFindManyArgs = {
    where: {
      date: {
        gte: startTime,
        lt: endTime,
      },
    },
  };

  return await findAllHolidays(query);
};

export const mergeHolidaysAndLeaves = (
  leaves: Leave[],
  holidays: Holidays[],
): DayDetails[] => {
  const mergedValues: DayDetails[] = [];

  leaves.forEach((_l) => {
    const dayLog: DayDetails = {
      recordId: _l.id,
      name: _l.type,
      date: _l.from,
      type: "leave",
      leaveType: _l.type,
      leaveStatus: _l.status,
    };
    mergedValues.push(dayLog);
  });

  holidays.forEach((_h) => {
    const dayLog: DayDetails = {
      recordId: _h.id,
      name: _h.name,
      date: _h.date,
      type: "holiday",
    };
    mergedValues.push(dayLog);
  });

  return mergedValues;
};
