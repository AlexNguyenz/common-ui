import { add, format, startOfYear } from "date-fns";

export function calculateStartAndEndYear(
  minYear: number,
  maxYear: number,
  day: Date,
  divide: number
) {
  const currentYear = startOfYear(day);
  const currentYearNumber = +format(currentYear, "yyyy");
  const resultModuloDivide = (currentYearNumber - minYear) % divide;
  const startYear = add(currentYear, {
    years: resultModuloDivide !== 0 ? -resultModuloDivide : 0,
  });
  const endYear = add(currentYear, {
    years:
      resultModuloDivide !== divide - 1
        ? divide - 1 - resultModuloDivide + currentYearNumber > maxYear
          ? maxYear - currentYearNumber
          : divide - 1 - resultModuloDivide
        : 0,
  });
  return { startYear, endYear };
}
