import type { IconType } from "$lib/services/types/icon";

export interface Presence {
  studentName: string;
  studentEmail: string;
  studentImg: string;
  courseTitle: string;
  loTitle: string;
  loImage: string;
  loRoute: string;
  loIcon?: IconType;
}
