import { writable, type Writable } from "svelte/store";
import type { User } from "$lib/services/types/auth";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Lo, Course } from "$lib/services/models/lo-types";
import type { LoEvent } from "./services/types/presence";

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const courseUrl = writable("");
export const currentCourse: Writable<Course> = writable();
export const currentLo: Writable<Lo> = writable();
export const currentLabStepIndex = writable(0);
export const currentUser: Writable<User> = writable();
export const layout = writable("");
export const transitionKey = writable("");
export const storeTheme = localStorageStore("storeTheme", "tutors");
export const storePreview = localStorageStore("storePreview", false);
export const onlineStatus = localStorageStore("onlineStatus", true);
export const authenticating: Writable<boolean> = writable(false);

export const studentsOnline = writable(0);
export const studentsOnlineList = writable<LoEvent[]>([]);

export const coursesOnline = writable(0);
export const coursesOnlineList = writable<LoEvent[]>([]);

export const allStudentsOnline = writable(0);
export const allStudentsOnlineList = writable<LoEvent[]>([]);
