import type { Course, Lo } from "$lib/services/models/lo-types";
import type { Session } from "@supabase/supabase-js";
import type { Analytics } from "./types/analytics";
import { onlineStatus } from "$lib/stores";
import { get } from "svelte/store";
import { presenceService } from "./presence";
import { updateStudentsStatus, storeStudentCourseLearningObjectInSupabase, updateStudentCourseLoInteractionDuration, updateDuration, updateCalendarDuration, addOrUpdateStudent, updateLastAccess, readValue, formatDate } from "./utils/supabase-utils";

export const supabaseAnalytics: Analytics = {
  loRoute: "",

  learningEvent(course: Course, params: Record<string, string>, session: Session, lo: Lo) {
    try {
      if (params.loid) {
        const targetRouteParts = lo.route.split('/');
        const trimmedTargetRoute = targetRouteParts.slice(0, 3).join('/');
        this.loRoute = trimmedTargetRoute+'/'+params.loid;
      }else{
        this.loRoute = lo.route;
      }
      this.reportPageLoad(course, session, lo);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  setOnlineStatus(course: Course, status: boolean, session: Session) {
    try {
      const onlineStatus = status ? "online" : "offline";
      updateStudentsStatus(session.user.user_metadata.user_name, onlineStatus);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  reportPageLoad(course: Course, session: Session, lo: Lo) {
    try {
      storeStudentCourseLearningObjectInSupabase(course, this.loRoute, lo, session?.user);
      presenceService.sendLoEvent(course, lo, get(onlineStatus), session);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  updatePageCount(course: Course, session: Session, lo: Lo) {
    try {
      if (session?.user) {
        if (lo.route) updateStudentCourseLoInteractionDuration(course.courseId, session?.user.user_metadata.user_name, this.loRoute);
        // updateDuration("id", "students", session.user.user_metadata.user_name);
        // updateLastAccess("id", session.user.user_metadata.user_name, "students");
        // updateDuration("course_id", "course", course.courseId);
        // updateLastAccess("course_id", course.courseId, "course");
        updateCalendarDuration(formatDate(new Date()), session.user.user_metadata.user_name, course.courseId);
      }
    } catch (error: any) {
      console.error(`TutorStore Error: ${error.message}`);
    }
  },

  async updateLogin(courseId: string, session: any) {
    try {
      await addOrUpdateStudent(session.user);
    } catch (error: any) {
      console.log(`TutorStore Error: ${error.message}`);
    }
  },

  getOnlineStatus: function (course: Course, session: Session): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!course || !session.user) {
        resolve("online");
      } else {
        const key = session.user.id;
        // Assuming readValue is an asynchronous function
        readValue(key)
          .then((status: string | undefined) => {
            resolve(status || "online");
          })
          .catch((error: any) => {
            reject(error);
          });
      }
    });
  }
};
