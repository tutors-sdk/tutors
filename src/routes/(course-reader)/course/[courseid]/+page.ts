import { courseService } from "$lib/services/course";
import { currentLo } from "$lib/stores";
import { supabaseProfile } from "$lib/services/profile/supabaseProfile.svelte.js";

export const ssr = false;

export const load = async ({ params, parent, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);

  const data = await parent();

  if (!data.session) {
    currentLo.set(course);
    return {
      course,
      lo: course
    };
  }

  if (data.session) {
    supabaseProfile.logCourseVisit(course, data.session.user.user_metadata.preferred_username);

    const { data: userCourseList } = await data.supabase.from("accessed_courses").select(`course_list`).eq("id", data.session.user.id);

    if (!userCourseList || userCourseList.length === 0) {
      await data.supabase.from("accessed_courses").insert([
        {
          id: data.session.user.id,
          course_list: {
            courses: [
              {
                id: course.courseId,
                name: course.title,
                last_accessed: new Date().toISOString(),
                visits: 1
              }
            ]
          }
        }
      ]);
    } else {
      const courseList = userCourseList[0].course_list;

      const courseIndex = courseList.courses.findIndex((c) => c.id === course.courseId);

      if (courseIndex === -1) {
        courseList.courses.push({
          id: course.courseId,
          name: course.title,
          last_accessed: new Date().toISOString(),
          visits: 1
        });
      } else {
        courseList.courses[courseIndex].last_accessed = new Date().toISOString();
        courseList.courses[courseIndex].visits++;
      }

      await data.supabase.from("accessed_courses").update({ course_list: courseList }).eq("id", data.session.user.id);
    }
  }

  currentLo.set(course);

  return {
    course,
    lo: course
  };
};
