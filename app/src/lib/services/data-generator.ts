import type { LoEvent } from "./types/presence";
import type { Course } from "./models/lo-types";
import { studentsOnline, studentsOnlineList, coursesOnline, coursesOnlineList, allStudentsOnlineList, allStudentsOnline } from "$lib/stores";
import { generateUser } from "$lib/services/utils/loGenerator";
import { initFirebase, readAllCourseIds } from "$lib/services/utils/firebase";
import { isValidCourseName } from "$lib/services/utils/all-course-access";
import { getKeys } from "$lib/environment";
import { courseService } from "$lib/services/course";

let studentLoEvents = new Array<LoEvent>();
let courseLoEvents = new Array<LoEvent>();
let validCourses = new Array<string>();

export async function startDataGeneratorService() {
    initFirebase(getKeys().firebase);
    const courses = await readAllCourseIds(getKeys().firebase);
    validCourses = courses.filter((courseId) => isValidCourseName(courseId));

    // Mock a single LoEvent to ensure that there is always a card present for demoing purposes
    mockNewStudent();

    // Replicate behaviour of students randomly opening and closing tutors courses
    setInterval(mockEvent, 5000);
}

function mockEvent() {
    let rand = Math.random();
    if (rand < 0.6) {
        mockActiveStudent();
    }
    else if (rand < 0.9) {
        mockNewStudent();
    }
    else {
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
        allStudentsOnlineList.set([...studentLoEvents]);
        allStudentsOnline.set(studentLoEvents.length);

        const registeredCourse = courseLoEvents.find((courseLoEvent) => courseLoEvent.courseId === loEvent.courseId);
        if (!registeredCourse) {
            addCourseLoEvent(loEvent);
        }
    }
    catch (error) {
        console.log(error);
    }
}

function mockInactiveStudent() {
    if (studentLoEvents.length > 0) {
        const index = Math.floor(Math.random() * studentLoEvents.length)
        const loEvent = studentLoEvents[index];
        studentLoEvents.splice(index, 1);
        allStudentsOnlineList.set([...studentLoEvents]);
        allStudentsOnline.set(studentLoEvents.length);

        const courseCount = studentLoEvents.filter((event) => event.courseId === loEvent.courseId).length;
        if (courseCount == 0) {
            deleteCourseLoEvent(loEvent.courseId);
        }
    }
}

function addCourseLoEvent(event: LoEvent) {
    courseLoEvents.push(event);
    coursesOnlineList.set([...courseLoEvents]);
    coursesOnline.set(courseLoEvents.length)
}

function deleteCourseLoEvent(courseId: string) {
    courseLoEvents = courseLoEvents.filter((courseLoEvent) => courseLoEvent.courseId != courseId);
    coursesOnlineList.set([...courseLoEvents]);
    coursesOnline.set(courseLoEvents.length);
}

function setCurrentCourseLo(lo: LoEvent, course: Course) {
    let index = Math.floor(Math.random() * course.los.length);
    const childLo = course.los[index];
    const route = childLo.route.replace("{{COURSEURL}}", course.courseId);
    lo.loRoute = `https://tutors.dev${route}`;
    lo.title = childLo.title;
    lo.img = childLo.img.replace("{{COURSEURL}}", `${course.courseId}.netlify.app`);
}

async function mockActiveStudent() {
    if (studentLoEvents.length > 0) {
        let index = Math.floor(Math.random() * studentLoEvents.length)
        const loEvent = studentLoEvents[index];
        let course = await courseService.getOrLoadCourse(loEvent.courseId, fetch);
        setCurrentCourseLo(loEvent, course);
    }
}