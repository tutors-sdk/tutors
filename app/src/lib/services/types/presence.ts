import type { IconType } from "$lib/services/models/lo-types";

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
