"use client";
import moment, { Moment } from "moment";
import classNames from "classnames";
import "./style.css";
import { EWeekDay } from "~/constants/enums";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import { Attendance, Holidays } from "@prisma/client";
import { geAttendanceForDay } from "~/actions/monthday";
import { LoadingSpinner } from "~/components/ui/spinner";
import SavedAttendanceDialog from "../SavedAttendanceDialog";
import OngoingAttendanceDialog from "../OngoingAttandanceDialog";
import { useToast } from "~/components/ui/use-toast";

type TMonthDayProps = {
  day: Moment;
  holiday?: Holidays;
};

export default function MonthDay({ day, holiday }: TMonthDayProps) {
  const { toast } = useToast();
  const isSameDay = day.isSame(moment(), "day");
  const isInSameMonth = day.isSame(moment(), "month");
  const weekDayName = day.format("dddd");
  const isWeekend =
    weekDayName === EWeekDay.Saturday || weekDayName === EWeekDay.Sunday;
  const isInFuture = day.isAfter(moment());
  const className = classNames(
    "flex items-top justify-end border-r border-b border-gray-200 px-2 py-1 flex-col relative cursor-pointer",
    {
      "bg-gray-100": isWeekend,
      "cursor-default": isInFuture,
    },
  );

  const labelClassName = classNames("absolute top-[4px] right-[8px]", {
    "bg-blue-500 text-white h-fit rounded-[50%] px-[4px]": isSameDay,
    "text-gray-400": isWeekend || !isInSameMonth,
  });

  const holidayLabelClassName = classNames(
    "capitalize px-[8px] py-[2px] rounded-sm text-xs",
    {
      "bg-yellow-200 text-gray-400": isWeekend || !isInSameMonth,
      "bg-yellow-400 text-black": !(isWeekend || !isInSameMonth),
    },
  );

  const [open, setOpen] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [currentAttendanceLog, setCurrentAttendanceLog] =
    useState<Attendance | null>(null);

  const toggleDialogAfterGettingRecord = async (isOpen: boolean) => {
    try {
      if (isOpen) {
        if (isInFuture) {
          toast({
            title: "Can not log hours for a future date.",
            description:
              "System does not allows to log hours for a future date.",
            className: "bg-yellow-500",
          });
        } else {
          setShowLoader(true);
          const attendanceLog = await geAttendanceForDay({
            date: day.toDate(),
          });
          setShowLoader(false);
          setOpen(isOpen);
          setCurrentAttendanceLog(attendanceLog);
        }
      } else {
        setOpen(isOpen);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={toggleDialogAfterGettingRecord}>
      <DialogTrigger asChild>
        <div className={className}>
          <span className={labelClassName}>{day.format("DD")}</span>
          <>
            {holiday && <p className={holidayLabelClassName}>{holiday.name}</p>}
          </>
          {showLoader && (
            <div className="absolute bottom-[0px] left-[0px] flex h-full w-full items-center justify-center bg-gray-100 bg-opacity-75">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        {!currentAttendanceLog && (
          <OngoingAttendanceDialog
            day={day}
            holiday={holiday}
            attendanceLog={undefined}
            closeDialog={closeDialog}
          />
        )}
        {currentAttendanceLog && currentAttendanceLog.isSubmitted && (
          <SavedAttendanceDialog
            day={day}
            holiday={holiday}
            attendanceLog={currentAttendanceLog}
          />
        )}
        {currentAttendanceLog && !currentAttendanceLog.isSubmitted && (
          <OngoingAttendanceDialog
            day={day}
            holiday={holiday}
            closeDialog={closeDialog}
            attendanceLog={currentAttendanceLog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
