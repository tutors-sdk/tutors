import { writable, type Writable } from "svelte/store";
import type { Lo, WeekType } from "$lib/types/lo";
import type { StudentLoEvent } from "$lib/types/metrics";
import type { User } from "$lib/types/auth";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Course } from "$lib/models/course";

const weekType: WeekType = {
  title: "",
  type: "",
  date: "",
  dateObj: null
};

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const week = writable(weekType);
export const courseUrl = writable("");
export const currentCourse: Writable<Course | null> = writable();
export const currentLo: Writable<Lo> = writable();
export const currentUser: Writable<User> = writable();
export const portfolio = writable(false);
export const layout = writable("");
export const transitionKey = writable("");
export const storeTheme = localStorageStore("storeTheme", "tutors");
export const storePreview = localStorageStore("storePreview", false);
export const onlineStatus = localStorageStore("onlineStatus", false);
export const authenticating: Writable<boolean> = writable(false);

const students: StudentLoEvent[] = [];
export const studentsOnline = writable(0);
export const studentsOnlineList = writable(students);
