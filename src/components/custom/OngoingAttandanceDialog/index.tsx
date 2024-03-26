"use client";
import { Attendance, Holidays } from "@prisma/client";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import moment, { Moment } from "moment";
import { RiPlayCircleFill, RiStopCircleFill } from "react-icons/ri";
import { Button } from "~/components/ui/button";
import { DialogHeader } from "~/components/ui/dialog";
import Timer from "../Timer";
import { endDay, startDay } from "~/actions/monthday";
import { Progress } from "~/components/ui/progress";
import classNames from "classnames";

type TOngoingAttendanceDialogProps = {
  day: Moment;
  holiday: Holidays | undefined;
  attendanceLog: Attendance | undefined;
  closeDialog: () => void;
};

export default function OngoingAttendanceDialog({
  day,
  holiday,
  attendanceLog,
  closeDialog,
}: TOngoingAttendanceDialogProps) {
  const hasStarted = attendanceLog && attendanceLog.startTime ? true : false;
  const startTime = hasStarted ? moment(attendanceLog?.startTime) : null;

  const handleStartButtonClick = async () => {
    try {
      const newRecord = await startDay(moment().toDate());
      closeDialog();
      console.log(newRecord);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEndButtonClick = async () => {
    try {
      const updatedRecord = await endDay(
        moment().toDate(),
        attendanceLog as Attendance,
      );
      closeDialog();
      console.log(updatedRecord);
    } catch (error) {
      console.error(error);
    }
  };

  const stopButtonClass = classNames(
    "flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border-0 bg-red-500 p-0 text-lg shadow hover:bg-red-600",
    {
      "bg-red-300 hover:bg-red-300 cursor-not-allowed": !hasStarted,
    },
  );
  return (
    <DialogHeader>
      <DialogTitle className="mb-5 flex gap-1 text-2xl font-medium">
        <span>Log your hours for</span>
        <p className="font-bold">{day.format("DD MMMM, YYYY")}</p>
      </DialogTitle>
      {holiday && (
        <div className="!mb-[3.2rem] flex items-center gap-2">
          <h2 className="font-semibold">Public Holidays:</h2>
          <p className="rounded-xl bg-yellow-400 px-2 py-[1px] text-xs capitalize">
            {holiday?.name}
          </p>
        </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={hasStarted}
          className="flex h-[50px] w-[50px] items-center justify-center rounded-[50%] border-0 bg-green-500  p-0 text-lg shadow hover:bg-green-600"
          onClick={handleStartButtonClick}
        >
          <RiPlayCircleFill className="text-2xl text-white " />
        </button>
        {hasStarted && <Progress className="h-1 w-[75%]" value={33} />}
        {/* <div className="h-[1px] w-full border-t-[2px] border-dashed border-gray-300">
        </div> */}
        {hasStarted && <Timer startDate={moment(attendanceLog?.startTime)} />}
        <button
          onClick={handleEndButtonClick}
          disabled={!hasStarted}
          className={stopButtonClass}
        >
          <RiStopCircleFill className="text-2xl text-white " />
        </button>
      </div>

      <DialogDescription></DialogDescription>
    </DialogHeader>
  );
}
