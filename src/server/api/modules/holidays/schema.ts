export type THolidayType = "Public" | "Optional"; // Adjust as needed

export type THoliday = {
  id: number;
  name: string;
  date: string;
  type: THolidayType;
};
