import { writable, type Writable } from "svelte/store";
import type { Lo, WeekType } from "../types/lo-types";
import type { StudentMetric } from "../types/metrics-types";
import type { User } from "../types/auth-types";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Course } from "../models/course";

const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null
};
const students: StudentMetric[] = [];

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse: Writable<Course> = writable();
export const currentLo: Writable<Lo> = writable();
export const currentUser: Writable<User> = writable();
export const portfolio = writable(false);
export const layout = writable("");
export const transitionKey = writable("");
export const studentsOnline = writable(0);
export const studentsOnlineList = writable(students);
export const infoDrawer: Writable<boolean> = writable(false);
export const calendarDrawer: Writable<boolean> = writable(false);
export const onlineDrawer: Writable<boolean> = writable(false);
export const tocDrawer: Writable<boolean> = writable(false);
export const themeBuilderDrawer: Writable<boolean> = writable(false);
export const storeTheme: Writable<string> = localStorageStore("storeTheme", "tutors");
export const authenticating: Writable<boolean> = writable(false);
