import type { Session } from "@supabase/supabase-js";
import type { Course, Lo } from "../models/lo-types";

export interface Analytics {
  loRoute: string;
  learningEvent(course: Course, params: Record<string, unknown>, session: Session, lo: Lo): void;
  setOnlineStatus(course: Course, status: boolean, session: Session): void;
  getOnlineStatus(course: Course, session: Session): Promise<string>;
  reportPageLoad(course: Course, session: Session, lo: Lo): void;
  updatePageCount(course: Course, session: Session, lo: Lo): void;
  updateLogin(courseId: string, session: any): void;
}
