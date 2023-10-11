import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  parse,
  startOfDay,
  startOfToday,
} from "date-fns";
import React, { useMemo, useState } from "react";
import { Button } from "../../atoms/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

/*  
  return func getDay of date-fns
  Sunday = 0 | Monday = 1 | Tuesday = 2 | Wednesday = 3 | Thursday = 4 | Friday = 5 | Saturday = 6
*/
const daysName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DatePickerProps {
  disablePast?: boolean;
  disableFuture?: boolean;
  disableOutOfMonth?: boolean;
  display?: "fullMonth" | "fullCalendar";
  type?: "month" | "year";
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  disablePast = false,
  disableFuture = false,
  disableOutOfMonth = true,
  display = "fullCalendar",
  type = "month",
  value,
  onChange,
}) => {
  const day = value ? startOfDay(value) : startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(day, "MMMM yyyy"));
  const [selectedDay, setSelectedDay] = useState(day);

  const firstDayOfCurrentMonth = parse(currentMonth, "MMMM yyyy", new Date(), {
    weekStartsOn: 1,
  });

  const handleGenerateDays = useMemo(() => {
    let start = firstDayOfCurrentMonth;
    let end = endOfMonth(firstDayOfCurrentMonth);

    if (display === "fullCalendar") {
      const startDayOfMonth = getDay(start);
      const endDayOfMonth = getDay(end);

      /* Monday = 1 */
      if (startDayOfMonth !== 1) {
        start = add(start, {
          days: startDayOfMonth === 0 ? -6 : 1 - startDayOfMonth,
        });
      }

      /* Sunday = 0 */
      if (endDayOfMonth !== 0) {
        end = add(end, {
          days: 7 - endDayOfMonth,
        });
      }
    }

    const days = eachDayOfInterval({
      start,
      end,
    });
    return days;
  }, [display, firstDayOfCurrentMonth]);

  const handleChangeDate = (date: Date) => {
    setSelectedDay(date);
    onChange?.(date);
  };

  const handleNextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMMM yyyy"));
  };

  const handlePreviousMonth = () => {
    const firstDayOfPreviousMonth = add(firstDayOfCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayOfPreviousMonth, "MMMM yyyy"));
  };

  const handlePositionStartDayOfMonth = (date: Date) => {
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 0) return 7;
    return dayOfWeek;
  };

  const handleDisableDayPastOrFuture = (date: Date) => {
    const dateToCompare = startOfToday();
    if (isBefore(date, dateToCompare)) {
      return disablePast ? true : false;
    }
    if (isAfter(date, dateToCompare)) {
      return disableFuture ? true : false;
    }
  };

  const handleDisableDayOutOfMonth = (date: Date) => {
    if (disableOutOfMonth) {
      const startDayOfMonth = firstDayOfCurrentMonth;
      const endDayOfMonth = endOfMonth(firstDayOfCurrentMonth);
      const disable =
        !isBefore(date, startDayOfMonth) && !isAfter(date, endDayOfMonth);
      return !disable;
    }
  };

  const generateDayOfMonth = () => {
    return handleGenerateDays.map((day, dayIndex) => (
      <Button
        key={day.toString()}
        size="icon"
        disabled={
          handleDisableDayPastOrFuture(day) || handleDisableDayOutOfMonth(day)
        }
        onClick={() => handleChangeDate(day)}
        variant={
          day.toString() === selectedDay.toString() ? "default" : "outline"
        }
        className={
          dayIndex === 0
            ? `col-start-${handlePositionStartDayOfMonth(day)}`
            : ""
        }
      >
        {format(day, "d")}
      </Button>
    ));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button size="icon" variant="ghost" onClick={handlePreviousMonth}>
          <ArrowLeftIcon />
        </Button>
        <p>{currentMonth}</p>
        <Button size="icon" variant="ghost" onClick={handleNextMonth}>
          <ArrowRightIcon />
        </Button>
      </div>
      <div className="grid grid-cols-7 items-center justify-between mt-2">
        {daysName.map((item) => (
          <p key={item} className="leading-7 text-center">
            {item}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {type === "month" && generateDayOfMonth()}
      </div>
    </>
  );
};

export default DatePicker;
