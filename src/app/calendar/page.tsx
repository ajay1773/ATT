"use client";
import { Holidays } from "@prisma/client";
import moment, { Moment } from "moment";
import { useState } from "react";
import Scheduler from "~/components/custom/Scheduler";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import { DayDetails } from "~/server/types";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Moment>(moment());
  const { data: holidaysInMonth, isLoading } =
    api.holidays.getHolidayForSpecificMonth.useQuery<Holidays[]>(
      { date: currentMonth.toDate() },
      { refetchOnWindowFocus: false },
    );

  const { data: dayDetailsForMonth, isLoading: isDayLogsLoading } =
    api.holidays.getHolidaysAndLeavesForTimePeriod.useQuery<DayDetails[]>(
      {
        startTime: moment().startOf("month").toDate(),
        endTime: moment().endOf("month").toDate(),
      },
      { refetchOnWindowFocus: false },
    );

  console.log(holidaysInMonth);

  return (
    <div className="flex min-h-full flex-col justify-between">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-4xl font-bold">
          {currentMonth.format("MMMM YYYY")}
        </h1>
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setCurrentMonth(currentMonth.clone().subtract(1, "month"));
            }}
          >
            <RiArrowLeftSFill className="text-xl" />
          </Button>
          <span>{currentMonth.format("MMM")}</span>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setCurrentMonth(currentMonth.clone().add(1, "month"));
            }}
          >
            <RiArrowRightSFill className="text-xl" />
          </Button>
        </div>
      </div>
      {!isDayLogsLoading && (
        <Scheduler
          month={currentMonth}
          holidays={holidaysInMonth}
          dayDetails={dayDetailsForMonth}
        />
      )}
    </div>
  );
}
