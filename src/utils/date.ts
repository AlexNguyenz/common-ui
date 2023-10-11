import { add, format, startOfYear } from "date-fns";

export function calculateStartAndEndYear(
  minYear: number,
  maxYear: number,
  day: Date,
  divide: number
) {
  const currentYear = startOfYear(day);
  const currentYearNumber = +format(currentYear, "yyyy");
  const resultModulo12 = (currentYearNumber - minYear) % divide;
  const startYear = add(currentYear, {
    years: resultModulo12 !== 0 ? -resultModulo12 : 0,
  });
  const endYear = add(currentYear, {
    years:
      resultModulo12 !== 11
        ? 11 - resultModulo12 + currentYearNumber > maxYear
          ? maxYear - currentYearNumber
          : 11 - resultModulo12
        : 0,
  });
  return { startYear, endYear };
}
