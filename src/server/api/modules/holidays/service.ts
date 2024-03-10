import path from "path";
import {
  createBufferFromByteArray,
  ensureFolderExists,
  readCsvFile,
  writeFileToFolder,
} from "~/server/utils/files";
import { THoliday } from "./schema";
import { createMultipleHolidayRecords, findAllHolidays } from "./repository";
import moment from "moment";
import { Prisma } from "@prisma/client";

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
    await createMultipleHolidayRecords({
      data: rows.map((row) => ({
        name: row.name,
        type: row.type,
        date: moment(row.date).toDate(),
      })),
    });
  }
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
