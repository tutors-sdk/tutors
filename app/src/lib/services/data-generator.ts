import type { LoEvent } from "./types/presence";
import { currentCourse, studentsOnline, studentsOnlineList, coursesOnline, coursesOnlineList, allStudentsOnlineList, allStudentsOnline } from "$lib/stores";
import { generateUser } from "$lib/services/utils/loGenerator"
import validCourses from "../../routes/(time)/gallery/+page";
import { getCourseSummary } from "$lib/services/utils/all-course-access";

let studentLoEvents = new Array<LoEvent>();
let courseLoEvents = new Array<LoEvent>();

export function startDataGeneratorService() {
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
    const loEvent = await generateLoEventData();
    studentLoEvents.push(loEvent);
    allStudentsOnlineList.set([...studentLoEvents]);
    allStudentsOnline.set(studentLoEvents.length);

    const registeredCourse = courseLoEvents.find((courseLoEvent) => courseLoEvent.courseId === loEvent.courseId);
    if (!registeredCourse) {
        addCourseLoEvent(loEvent);
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

async function generateLoEventData() {
    const courseId = validCourses[Math.floor(Math.random() * validCourses.length)];
    let courseSummary = await getCourseSummary(courseId);

    const lo: LoEvent = {
        courseId: courseId,
        courseUrl: courseSummary.route,
        img: courseSummary.img,
        title: courseSummary.title,
        courseTitle: courseSummary.title,
        loRoute: courseSummary.route,
        user: generateUser(),
        isPrivate: courseSummary.isPrivate
    };
    return lo;
}

async function mockActiveStudent() {
    if (studentLoEvents.length > 0) {
        let index = Math.floor(Math.random() * studentLoEvents.length)
        const loEvent = studentLoEvents[index];
        const response = await fetch(`https://${loEvent.courseId}.netlify.app/tutors.json`);
        const courseDetails = await response.json();

        index = Math.floor(Math.random() * courseDetails.los.length);
        const newLo = courseDetails.los[index];
        const newRoute = newLo.route.replace("{{COURSEURL}}", loEvent.courseId);
        loEvent.loRoute = `https://tutors.dev${newRoute}`;
        loEvent.title = newLo.title;
        loEvent.img = newLo.img.replace("{{COURSEURL}}", `${loEvent.courseId}.netlify.app`);
    }
}