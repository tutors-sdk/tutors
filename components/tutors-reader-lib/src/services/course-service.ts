import path from "path-browserify";
import { courseUrl, currentCourse, currentLo, currentUser, week } from "tutors-course-reader/src/stores";
import { replace } from "svelte-spa-router";
import { Course } from "tutors-reader-lib/src/models/course";
import { Lab } from "tutors-reader-lib/src/models/lab";
import { lastSegment } from "tutors-reader-lib/src/utils/lo-utils";
import { fromLocalStorage, getUserId, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
import { fetchUserById } from "tutors-reader-lib/src/utils/metrics-utils";
import axios from "axios";
import type { Lo, WeekType } from "tutors-reader-lib/src/types/lo-types";
import type { Topic } from "tutors-reader-lib/src/models/topic";
import { getKeys } from "tutors-course-reader/src/environment";

export class CourseService {
  course: Course;
  courses = new Map<string, Course>();
  courseUrl = "";

  async getOrLoadCourse(courseId: string): Promise<Course> {
    let course = this.courses.get(courseId);
    if (!course) {
      const courseUrl = "https://" + courseId + "/tutors.json";
      try {
        const response = await axios.get<Lo>(courseUrl);
        course = new Course(response.data, courseId);
        this.courses.set(courseId, course);
        return course;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    return course;
  }

  async checkAuthenticated(course: Course) {
    if (getKeys().firebase.apiKey === "XXX") return;
    if (isAuthenticated()) {
      const user = await fetchUserById(course.url, getUserId(), null);
      currentUser.set(user);
    }
  }

  async checkWhiteList(course: Course) {
    if (course.hasWhiteList()) {
      if (isAuthenticated()) {
        const user = fromLocalStorage();
        const student = course.getStudents().find((student) => student.github === user.nickname);
        if (!student) {
          console.log("Not Authorised to access this models");
          await replace(`/unauthorised`);
        }
      }
    }
  }

  async readCourse(courseId: string): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId);
    currentCourse.set(course);
    courseUrl.set(course.url);
    week.set(course?.currentWeek);
    await this.checkAuthenticated(course);
    await this.checkWhiteList(course);
    this.course = course;
    return course;
  }

  async readTopic(topicId: string): Promise<Topic> {
    const courseId = path.dirname(topicId);
    const course = await this.readCourse(courseId);
    const topic = course.topicIndex.get(lastSegment(topicId));
    currentLo.set(topic.lo);
    return topic;
  }

  async readLab(url: string): Promise<Lab> {
    const courseId = url.substring(0, url.indexOf("/"));
    const course = await this.readCourse(courseId);
    let labId = `/#/lab/${url}`;
    const lastSegment = url.substr(url.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      url = url.substr(0, url.lastIndexOf("/"));
      labId = `/#/lab/${url}`;
    }
    const lo = course.loIndex.get(labId);
    let lab = course.hydratedLabs.get(labId);
    if (!lab) {
      lab = new Lab(course, lo, url);
      course.hydratedLabs.set(labId, lab);
    }
    currentLo.set(lab.lo);
    return lab;
  }

  async readWall(url: string): Promise<Lo[]> {
    const path = url.split("/");
    const course = await this.readCourse(path[1]);
    const wall = course.walls.get(path[0]);
    return wall;
  }

  async readLo(url: string, loType: string): Promise<Lo> {
    const courseId = url.substring(0, url.indexOf("/"));
    const course = await this.readCourse(courseId);
    const ref = `/#/${loType}/${url}`;
    const lo = course.loIndex.get(ref);
    currentLo.set(lo);
    return lo;
  }
}
