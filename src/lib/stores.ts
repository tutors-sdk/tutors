import { writable, type Writable } from "svelte/store";
import { localStorageStore } from "@skeletonlabs/skeleton";
import type { Lo, Course } from "$lib/services/models/lo-types";
import type { LoEvent } from "./services/types/presence";
import type { Session } from "@supabase/supabase-js";

export const revealSidebar = writable(false);
export const revealOnline = writable(false);
export const courseUrl = writable("");
export const currentCourse: Writable<Course> = writable();
export const currentLo: Writable<Lo> = writable();
export const currentLabStepIndex = writable(0);
export const currentSession: Writable<Session> = writable();
export const layout = writable("");
export const transitionKey = writable("");
export const storePreview = localStorageStore("storePreview", false);
export const onlineStatus = localStorageStore("onlineStatus", true);
export const authenticating: Writable<boolean> = writable(false);

export const studentsOnline = writable(0);
export const studentsOnlineList = writable<LoEvent[]>([]);

export const coursesOnline = writable(0);
export const coursesOnlineList = writable<LoEvent[]>([]);

export const allStudentsOnline = writable(0);
export const allStudentsOnlineList = writable<LoEvent[]>([]);

let initialTheme = "tutors"; // Default value
export const setInitialTheme = (theme: string) => {
    initialTheme = theme;
};

export const storeTheme = localStorageStore("storeTheme", initialTheme);
