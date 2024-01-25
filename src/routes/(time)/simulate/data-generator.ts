import type { LoEvent } from "$lib/services/types/presence";
import type { Course } from "$lib/services/models/lo-types";
import { generateUser } from "./loGenerator";
import { isValidCourseName } from "$lib/services/utils/all-course-access";
import { courseService } from "$lib/services/course";
import { presenceSimulatorService } from "./presence-simulator";

let studentLoEvents = new Array<LoEvent>();
let courseLoEvents = new Array<LoEvent>();
let validCourses = new Array<string>();

let intervalId: any;

export async function startDataGeneratorService(courses: string[]) {
  validCourses = courses.filter((courseId) => isValidCourseName(courseId));
  mockNewStudent();
  intervalId = setInterval(mockEvent, 5000);
  presenceSimulatorService.startSimulatorPresenceService();
}

export async function stopDataGeneratorService() {
  clearInterval(intervalId);
}

function mockEvent() {
  let rand = Math.random();
  if (rand < 0.6) {
    mockActiveStudent();
  } else if (rand < 0.9) {
    mockNewStudent();
  } else {
    mockInactiveStudent();
  }
}

async function mockNewStudent() {
  try {
    const courseId = validCourses[Math.floor(Math.random() * validCourses.length)];
    let course = await courseService.getOrLoadCourse(courseId, fetch).catch();
    const loEvent: LoEvent = {
      courseId: courseId,
      courseUrl: course.route,
      img: course.img,
      title: course.title,
      courseTitle: course.title,
      loRoute: course.route,
      user: generateUser(),
      isPrivate: course.isPrivate
    };
    setCurrentCourseLo(loEvent, course);

    studentLoEvents.push(loEvent);

    const registeredCourse = courseLoEvents.find((courseLoEvent) => courseLoEvent.courseId === loEvent.courseId);
    if (!registeredCourse) {
      addCourseLoEvent(loEvent);
    }
  } catch (error) {
    console.log(error);
  }
}

function mockInactiveStudent() {
  if (studentLoEvents.length > 0) {
    const index = Math.floor(Math.random() * studentLoEvents.length);
    const loEvent = studentLoEvents[index];
    studentLoEvents.splice(index, 1);

    const courseCount = studentLoEvents.filter((event) => event.courseId === loEvent.courseId).length;
    if (courseCount == 0) {
      deleteCourseLoEvent(loEvent.courseId);
    }
  }
}

function addCourseLoEvent(event: LoEvent) {
  courseLoEvents.push(event);
}

function deleteCourseLoEvent(courseId: string) {
  courseLoEvents = courseLoEvents.filter((courseLoEvent) => courseLoEvent.courseId != courseId);
}

function setCurrentCourseLo(lo: LoEvent, course: Course) {
  let index = Math.floor(Math.random() * course.los.length);
  const childLo = course.los[index];
  const route = childLo.route.replace("{{COURSEURL}}", course.courseId);
  lo.loRoute = `${route}`;
  lo.title = childLo.title;
  lo.img = childLo.img.replace("{{COURSEURL}}", `${course.courseId}.netlify.app`);

  presenceSimulatorService.simulateLoEvent(lo);
}

async function mockActiveStudent() {
  if (studentLoEvents.length > 0) {
    let index = Math.floor(Math.random() * studentLoEvents.length);
    const loEvent = studentLoEvents[index];
    let course = await courseService.getOrLoadCourse(loEvent.courseId, fetch);
    setCurrentCourseLo(loEvent, course);
  }
}
