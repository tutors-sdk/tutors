import { writable, type Writable } from "svelte/store";
import type { StudentLoEvent } from "$lib/services/types/metrics";
import type { User } from "$lib/services/types/auth";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Lo, WeekType, Course } from "$lib/services/models/lo-types"

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
