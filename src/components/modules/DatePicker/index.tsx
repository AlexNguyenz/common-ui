import {
  add,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getDay,
  isAfter,
  isBefore,
  parse,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfYear,
} from "date-fns";
import React, { useMemo, useState } from "react";
import { Button } from "../../atoms/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { calculateStartAndEndYear } from "../../../utils/date";

/*  
  return func getDay of date-fns
  Sunday = 0 | Monday = 1 | Tuesday = 2 | Wednesday = 3 | Thursday = 4 | Friday = 5 | Saturday = 6
*/
const daysName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Content = "day" | "month" | "year";

interface DatePickerProps {
  disablePast?: boolean;
  disableFuture?: boolean;
  disableOutOfMonth?: boolean;
  display?: "fullMonth" | "fullCalendar";
  type?: "month" | "year";
  minYear?: number;
  maxYear?: number;
  value?: Date;
  onChange?: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  disablePast = false,
  disableFuture = false,
  disableOutOfMonth = true,
  display = "fullCalendar",
  type = "year",
  minYear = 1000,
  maxYear = 9999,
  value,
  onChange,
}) => {
  const day = value ? startOfDay(value) : startOfToday();
  const [displayContent, setDisplayContent] = useState<Content>("day");
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(day));
  const [currentYear, setCurrentYear] = useState(startOfYear(day));
  const [selectedDay, setSelectedDay] = useState(day);
  const [years, setYears] = useState({
    startYear: calculateStartAndEndYear(minYear, maxYear, day, 12).startYear,
    endYear: calculateStartAndEndYear(minYear, maxYear, day, 12).endYear,
  });
  const firstDayOfCurrentMonth = parse(
    format(currentMonth, "MMMM yyyy"),
    "MMMM yyyy",
    new Date(),
    {
      weekStartsOn: 1,
    }
  );

  const handleGenerateDaysOfMonth = useMemo(() => {
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

  const handleGenerateMonthsOfYear = useMemo(() => {
    const startYear = startOfYear(currentMonth);
    const endYear = endOfYear(currentMonth);
    const months = eachMonthOfInterval({ start: startYear, end: endYear });
    return months;
  }, [currentMonth]);

  const handleGenerateYears = useMemo(() => {
    const listYears = eachYearOfInterval({
      start: years.startYear,
      end: years.endYear,
    });
    return listYears;
  }, [years]);

  const handleChangeDate = (date: Date) => {
    setSelectedDay(date);
    onChange?.(date);
  };

  const handleChangeMonth = (date: Date) => {
    setCurrentMonth(date);
    setDisplayContent("day");
  };

  const handleChangeYear = (date: Date) => {
    setCurrentYear(date);
    setCurrentMonth(startOfMonth(date));
    setDisplayContent("month");
  };

  const handleNextBtn = () => {
    if (type === "month") {
      const firstDayOfNextMonth = add(firstDayOfCurrentMonth, { months: 1 });
      setCurrentMonth(firstDayOfNextMonth);
      return;
    }

    const startYearNumber = +format(years.startYear, "yyyy");
    const endYearNumber = +format(years.endYear, "yyyy");
    const nextStartYear = add(years.startYear, {
      years: startYearNumber + 12 >= maxYear ? 0 : 12,
    });
    const nextEndYear = add(years.endYear, {
      years: endYearNumber + 12 >= maxYear ? 0 : 12,
    });
    setYears({ startYear: nextStartYear, endYear: nextEndYear });
    return;
  };

  const handlePreviousBtn = () => {
    if (type === "month") {
      const firstDayOfPreviousMonth = add(firstDayOfCurrentMonth, {
        months: -1,
      });
      setCurrentMonth(firstDayOfPreviousMonth);
      return;
    }

    const startYearNumber = +format(years.startYear, "yyyy");
    const endYearNumber = +format(years.endYear, "yyyy");
    const previousStartYear = add(years.startYear, {
      years: startYearNumber === minYear ? 0 : -12,
    });
    const previousEndYear = add(years.endYear, {
      years: endYearNumber - 12 <= minYear ? 0 : -12,
    });
    setYears({ startYear: previousStartYear, endYear: previousEndYear });
    return;
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
      const enable =
        !isBefore(date, startDayOfMonth) && !isAfter(date, endDayOfMonth);
      return !enable;
    }
  };

  const generateDayOfMonth = () => {
    return (
      <div className="grid grid-cols-7 gap-2 mt-2">
        {handleGenerateDaysOfMonth.map((day, dayIndex) => {
          return (
            <Button
              key={day.toString()}
              size="icon"
              disabled={
                handleDisableDayPastOrFuture(day) ||
                handleDisableDayOutOfMonth(day)
              }
              onClick={() => handleChangeDate(day)}
              variant={
                day.toString() === selectedDay.toString()
                  ? "default"
                  : "outline"
              }
              className={
                dayIndex === 0
                  ? `col-start-${handlePositionStartDayOfMonth(day)}`
                  : ""
              }
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    );
  };

  const generateMonthOfYear = () => {
    return (
      <div className="grid grid-cols-4 gap-2 mt-2">
        {handleGenerateMonthsOfYear.map((month) => {
          return (
            <Button
              key={month.toString()}
              onClick={() => handleChangeMonth(month)}
              variant={
                firstDayOfCurrentMonth.toString() === month.toString()
                  ? "default"
                  : "outline"
              }
            >
              {format(month, "MMMM")}
            </Button>
          );
        })}
      </div>
    );
  };

  const generateYears = () => {
    return (
      <div className="grid grid-cols-4 gap-2 mt-2">
        {handleGenerateYears.map((year) => {
          return (
            <Button
              key={year.toString()}
              onClick={() => handleChangeYear(year)}
              variant={
                currentYear.toString() === year.toString()
                  ? "default"
                  : "outline"
              }
            >
              {format(year, "yyyy")}
            </Button>
          );
        })}
      </div>
    );
  };

  const displayTitleHeader = useMemo(() => {
    if (type === "year") {
      return (
        <div className="inline-flex items-center justify-center gap-3">
          <p
            className="cursor-pointer inline-flex items-center gap-1"
            onClick={() => setDisplayContent("month")}
          >
            {format(currentMonth, "MMMM")}
            <ChevronDownIcon />
          </p>
          <p
            className="cursor-pointer inline-flex items-center gap-1"
            onClick={() => setDisplayContent("year")}
          >
            {format(currentYear, "yyyy")}
            <ChevronDownIcon />
          </p>
        </div>
      );
    }
    return <p>{format(currentMonth, "MMMM yyyy")}</p>;
  }, [type, currentMonth, currentYear]);

  const displayContentCalendar: Record<Content, JSX.Element> = {
    day: generateDayOfMonth(),
    month: generateMonthOfYear(),
    year: generateYears(),
  };

  return (
    <>
      <div
        className={`flex items-center ${
          type === "month" || displayContent === "year"
            ? "justify-between"
            : "justify-center"
        }`}
      >
        {(type === "month" || displayContent === "year") && (
          <Button size="icon" variant="ghost" onClick={handlePreviousBtn}>
            <ArrowLeftIcon />
          </Button>
        )}

        {displayTitleHeader}

        {(type === "month" || displayContent === "year") && (
          <Button size="icon" variant="ghost" onClick={handleNextBtn}>
            <ArrowRightIcon />
          </Button>
        )}
      </div>
      {displayContent === "day" && (
        <div className="grid grid-cols-7 items-center justify-between mt-2">
          {daysName.map((item) => (
            <p key={item} className="leading-7 text-center">
              {item}
            </p>
          ))}
        </div>
      )}
      {displayContentCalendar[displayContent]}
    </>
  );
};

export default DatePicker;
