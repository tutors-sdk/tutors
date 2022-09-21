import { writable } from "svelte/store";
import type { WeekType } from "./reader-lib/types/lo-types";
const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null
};
export const revealSidebar = writable(false);
export const profile = writable({ show: false, bar: [] });
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse = writable(null);
export const currentLo = writable(null);
export const currentUser = writable(null);
export const studentsOnline = writable(0);
export const live = writable(false);
export const layout = writable("");
export const portfolio = writable(false);
