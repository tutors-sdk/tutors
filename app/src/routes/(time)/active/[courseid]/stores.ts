import type { StudentLoEvent } from "$lib/services/types/metrics";
import { writable } from "svelte/store";

const students: StudentLoEvent[] = [];
export const studentsOnline = writable(0);
export const studentsOnlineList = writable(students);
