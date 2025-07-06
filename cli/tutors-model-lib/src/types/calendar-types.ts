/**
 * Calendar-related types
 */

/**
 * Represents a week in the course calendar
 */
export type WeekType = {
  title: string;
  type: string;
  date: string;
  dateObj: Date;
};

/**
 * Course calendar structure
 */
export type Calendar = {
  title: string;
  weeks: WeekType[];
  currentWeek?: WeekType;
};
