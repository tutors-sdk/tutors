import type { IconType } from "@tutors/tutors-model-lib";

export interface ProgrammeJson {
  title: string;
  summary: string;
  img?: string;
  icon?: IconType;
  courses: string[];
  properties?: Record<string, string>;
}

export interface ProgrammeCourseSummary {
  courseId: string;
  title: string;
  summary: string;
  img?: string;
  icon?: IconType;
  credits?: string;
  route: string;
}

export interface Programme {
  programmeId: string;
  title: string;
  summary: string;
  img?: string;
  icon?: IconType;
  properties?: Record<string, string>;
  courses: ProgrammeCourseSummary[];
}
