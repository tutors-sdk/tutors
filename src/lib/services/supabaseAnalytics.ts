import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/auth-js/src/lib/types";
import type { Analytics } from "./types/analytics";

export const supabaseAnalytics: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {},

  setOnlineStatus(course: Course, status: boolean, session: Session) {},

  reportPageLoad(course: Course, session: Session, lo: Lo) {},

  updatePageCount(course: Course, session: Session, lo: Lo) {},

  updateLogin(courseId: string, session: any) {},

  getOnlineStatus: function (course: Course, session: Session): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve("online");
    });
  }
};
