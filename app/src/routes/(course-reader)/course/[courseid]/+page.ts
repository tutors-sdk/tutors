import { courseService } from "$lib/services/course-ng";
import type { Course } from "$lib/services/models-ng/lo-types";
import { currentLo } from "$lib/stores";

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

  if (data.session && !course.lo?.properties?.parent) {
    const { data: userCourseList } = await data.supabase
      .from("accessed_courses")
      .select(`course_list`)
      .eq("id", data.session.user.id);

    if (!userCourseList || userCourseList.length === 0) {
      await data.supabase.from("accessed_courses").insert([
        {
          id: data.session.user.id,
          course_list: {
            courses: [
              {
                id: course.id,
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

      const courseIndex = courseList.courses.findIndex((c) => c.id === course.id);

      if (courseIndex === -1) {
        courseList.courses.push({
          id: course.id,
          name: course.title,
          last_accessed: new Date().toISOString(),
          visits: 1
        });
      } else {
        courseList.courses[courseIndex].last_accessed = new Date().toISOString();
        courseList.courses[courseIndex].visits++;
      }

      await data.supabase
        .from("accessed_courses")
        .update({ course_list: courseList })
        .eq("id", data.session.user.id);
    }
  }

  currentLo.set(course.lo);

  return {
    course,
    lo: course
  };
};
