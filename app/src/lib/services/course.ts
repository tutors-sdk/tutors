import { courseUrl, currentCourse, currentLo, week } from "$lib/stores";
import { Course } from "$lib/models/course";
import { Lab } from "$lib/models/lab";
import type { Lo } from "$lib/types/lo";
import type { Topic } from "$lib/models/topic";

export const courseService = {
  course: Course,
  courses: new Map<string, Course>(),
  courseUrl: "",

  async getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    let course = this.courses.get(courseId);
    let courseUrl = courseId;

    if (!course) {
      if (!courseId.includes(".netlify.app") && !courseId.includes(".tutors.dev")) {
        courseUrl = `${courseId}.netlify.app`;
      } else {
        courseId = courseId.split(".")[0];
      }

      try {
        const response = await fetchFunction(`https://${courseUrl}/tutors.json`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        course = new Course(data, courseId, courseUrl);
        this.courses.set(courseId, course);
      } catch (error) {
        console.error(`Error fetching from URL: https://${courseUrl}/tutors.json`);
        console.error(error);
        throw error;
      }
    }

    return course;
  },

  async readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId, fetchFunction);
    currentCourse.set(course);
    courseUrl.set(course.url);
    week.set(course?.currentWeek);
    this.course = course;
    return course;
  },

  async readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Topic> {
    const course = await this.readCourse(courseId, fetchFunction);
    const topic = course.topicIndex.get(topicId);
    currentLo.set(topic.lo);
    return topic;
  },

  async readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<Lab> {
    const course = await this.readCourse(courseId, fetchFunction);

    const lastSegment = labId.substring(labId.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      labId = labId.slice(0, labId.lastIndexOf("/"));
    }

    const lo = course.loIndex.get(labId);
    const lab = course.hydratedLabs.get(labId) || new Lab(course, lo, labId);
    course.hydratedLabs.set(labId, lab);

    currentLo.set(lab.lo);
    return lab;
  },

  async readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]> {
    const course = await this.readCourse(courseId, fetchFunction);
    const wall = course.walls.get(type);
    return wall;
  },

  async readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const lo = course.loIndex.get(loId);
    currentLo.set(lo);
    return lo;
  }
};
