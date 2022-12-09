import { courseUrl, currentCourse, currentLo, week } from "../stores/stores";
import { Course } from "../models/course";
import { Lab } from "../models/lab";
import axios from "axios";
import type { Lo } from "../types/lo-types";
import type { Topic } from "../models/topic";

export const courseService = {
  course: Course,
  courses: new Map<string, Course>(),
  courseUrl: "",

  async getOrLoadCourse(courseId: string): Promise<Course> {
    let course = this.courses.get(courseId);
    let courseUrl = courseId;
    if (!course) {
      if (!courseId.includes(".netlify.app")) {
        courseUrl = `${courseId}.netlify.app`;
      } else {
        courseId = courseId.split(".")[0];
      }
      try {
        console.log(`URL: ${courseUrl}/tutors.json`);
        const response = await axios.get<Lo>(`https://${courseUrl}/tutors.json`);
        course = new Course(response.data, courseId, courseUrl);
        this.courses.set(courseId, course);
        return course;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    return course;
  },

  async readCourse(courseId: string): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId);
    currentCourse.set(course);
    courseUrl.set(course.url);
    week.set(course?.currentWeek);
    this.course = course;
    return course;
  },

  async readTopic(courseId: string, topicId: string): Promise<Topic> {
    const course = await this.readCourse(courseId);
    const topic = course.topicIndex.get(topicId);
    currentLo.set(topic.lo);
    return topic;
  },

  async readLab(courseId: string, labId: string): Promise<Lab> {
    const course = await this.readCourse(courseId);

    const lastSegment = labId.substr(labId.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      labId = labId.substr(0, labId.lastIndexOf("/"));
    }
    const lo = course.loIndex.get(labId);
    let lab = course.hydratedLabs.get(labId);
    if (!lab) {
      lab = new Lab(course, lo, labId);
      course.hydratedLabs.set(labId, lab);
    }
    currentLo.set(lab.lo);
    return lab;
  },

  async readWall(courseId: string, type: string): Promise<Lo[]> {
    const course = await this.readCourse(courseId);
    const wall = course.walls.get(type);
    return wall;
  },

  async readLo(courseId: string, loId: string): Promise<Lo> {
    const course = await this.readCourse(courseId);
    const lo = course.loIndex.get(loId);
    currentLo.set(lo);
    return lo;
  }
};
