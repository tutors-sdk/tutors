import { writable } from "svelte/store";
import type { WeekType } from "tutors-reader-lib/src/types/lo-types";
const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null,
};
export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const revealInfoBar = writable(false);
export const revealCalendar = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse = writable(null);
export const currentLo = writable(null);
export const currentUser = writable(null);
export const portfolio = writable(false);
export const layout = writable("");
export const studentsOnline = writable(0);
