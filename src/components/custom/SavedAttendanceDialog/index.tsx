import { Attendance, Holidays } from "@prisma/client";
import moment, { Moment } from "moment";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "~/components/ui/dialog";

type TOngoingAttendanceDialogProps = {
  day: Moment;
  holiday: Holidays | undefined;
  attendanceLog: Attendance;
};

export default function SavedAttendanceDialog({
  day,
  holiday,
  attendanceLog,
}: TOngoingAttendanceDialogProps) {
  const startTime: string = moment(attendanceLog.startTime).format("LT");
  const endTime: string = moment(attendanceLog.endTime).format("LT");
  const totalHours = moment(attendanceLog.endTime).diff(
    moment(attendanceLog.startTime),
    "hours",
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-5 flex gap-1 text-2xl font-medium">
          <span>Logged Details For</span>
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
        <div className="flex justify-center">
          <span>
            From:
            <p>{startTime}</p>
          </span>
          <span>
            To:
            <p>{endTime}</p>
          </span>
        </div>
        <span>
          Total Hours:
          <p>{totalHours}</p>
        </span>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
