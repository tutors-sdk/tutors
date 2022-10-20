import { writable, type Writable } from "svelte/store";
import type { WeekType } from "tutors-reader-lib/src/types/lo-types";
import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
import { localStorageStore } from "@brainandbones/skeleton";
const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null,
};
let students: StudentMetric[] = [];

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse = writable(null);
export const currentLo = writable(null);
export const currentUser = writable(null);
export const portfolio = writable(false);
export const layout = writable("");
export const studentsOnline = writable(0);
export const studentsOnlineList = writable(students);
export const infoDrawer: Writable<boolean> = writable(false);
export const calendarDrawer: Writable<boolean> = writable(false);
export const onlineDrawer: Writable<boolean> = writable(false);
export const tocDrawer: Writable<boolean> = writable(false);
export const storeTheme: Writable<string> = localStorageStore('storeTheme', 'tutors');