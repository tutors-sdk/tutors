import type { IconType, Lo } from "$lib/services/models/lo-types";

export interface LoUser {
  fullName: string;
  avatar: string;
  id: string;
}

export interface LoEvent {
  courseId: string;
  courseUrl: string;
  courseTitle: string;
  loRoute: string;
  title: string;
  img?: string;
  icon?: IconType;
  isPrivate: boolean;
  user: LoUser;
  type: string;
}
