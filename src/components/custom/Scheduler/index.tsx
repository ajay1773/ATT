import moment, { Moment } from "moment";
import { find, isEmpty, map, times } from "lodash";
import { DaysOfWeek } from "~/constants/maps";
import Weekday from "../Weekday";
import { TWeekDayLabel } from "~/constants/types";
import MonthDay from "../MonthDay";
import "./style.css";
import { Holidays } from "@prisma/client";
import { DayDetails } from "~/server/types";

type TSchedulerProps = {
  month: Moment;
  holidays: Holidays[] | undefined;
  dayDetails: DayDetails[] | undefined;
};

export default function Scheduler({
  month,
  holidays,
  dayDetails,
}: TSchedulerProps) {
  const totalNumberOfCells = 42;
  const daysOfLastMonth: Moment[] = [];
  const daysOfCurrentMonth: Moment[] = [];
  const daysOfNextMonth: Moment[] = [];
  const today = moment();
  let currentDateIsInLastMonth = false;
  const firstDayOfMonth = month.startOf("month").day();
  const totalNumberOfDaysInCurrentMonth = month.daysInMonth();
  const numberOfDaysOfLastMonthInFirstRow = firstDayOfMonth;
  const numberOfDaysOfNextMonthInLastRow =
    totalNumberOfCells -
    (totalNumberOfDaysInCurrentMonth + numberOfDaysOfLastMonthInFirstRow);

  times(totalNumberOfDaysInCurrentMonth, (day) => {
    daysOfCurrentMonth.push(month.clone().date(day + 1));
  });

  if (numberOfDaysOfLastMonthInFirstRow) {
    times(numberOfDaysOfLastMonthInFirstRow, (day) => {
      daysOfLastMonth.push(
        month
          .clone()
          .startOf("month")
          .subtract(day + 1, "day"),
      );
    });
    currentDateIsInLastMonth = daysOfLastMonth.some((date) =>
      date.isSame(today, "day"),
    )
      ? true
      : false;
  }

  if (numberOfDaysOfNextMonthInLastRow) {
    times(numberOfDaysOfNextMonthInLastRow, (day) => {
      daysOfNextMonth.push(
        month
          .clone()
          .add(1, "month")
          .date(day + 1),
      );
    });
  }

  return (
    <div className="h-full w-full rounded-md bg-white p-6 shadow">
      <div className="scheduler__week border-l border-transparent ">
        {times(7, (n) => {
          const label = DaysOfWeek.get(n);
          return (
            <Weekday
              key={n}
              labels={label as TWeekDayLabel}
              index={n}
              month={month}
              currentDateIsInLastMonth={currentDateIsInLastMonth}
            />
          );
        })}
      </div>
      <div className="scheduler__month border-l border-gray-200">
        {!isEmpty(daysOfLastMonth) &&
          map(daysOfLastMonth.reverse(), (day) => (
            <MonthDay key={day.format("DD MM")} day={day} />
          ))}
        {!isEmpty(daysOfCurrentMonth) &&
          map(daysOfCurrentMonth, (day) => {
            const isAHoliday: Holidays | undefined = find(
              holidays,
              (holiday) => day.date() === moment(holiday.date).date(),
            );

            const isAHolidayOrLeave: DayDetails | undefined = find(
              dayDetails,
              (detail: DayDetails) => moment(detail.date).date() === day.date(),
            );

            return (
              <MonthDay
                key={day.format("DD MM")}
                day={day}
                holiday={isAHoliday}
                dayDetails={isAHolidayOrLeave}
              />
            );
          })}
        {!isEmpty(daysOfNextMonth) &&
          map(daysOfNextMonth, (day) => (
            <MonthDay key={day.format("DD MM")} day={day} />
          ))}
      </div>
    </div>
  );
}
