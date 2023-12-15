import type { LoEvent, LoUser } from "./types/presence";
import { currentCourse, studentsOnline, studentsOnlineList, coursesOnline, coursesOnlineList, allStudentsOnlineList, allStudentsOnline } from "$lib/stores";
import { getTestUser } from "./utils/user-generator"


let studentLoEvents = new Array<LoEvent>();
let courseLoEvents = new Array<LoEvent>();

export function startDataGeneratorService() {
    // Mock a single LoEvent to ensure that there is always a card present for demoing purposes
    mockActiveStudent();

    // Replicate behaviour of students randomly opening and closing tutors courses
    setInterval(mockEvent, 5000);
}

function mockEvent() {
    if (Math.random() < 0.6) {
        mockActiveStudent();
    }
    else {
        mockInactiveStudent();
    }
}

function mockActiveStudent() {
    const loEvent = generateLoEventData();
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

// TODO generate the LoEvent dynamically
function generateLoEventData() {
    const lo: LoEvent = {
        courseId: "reference-course",
        courseUrl: "reference-course.netlify.app",
        img: "https://reference-course.netlify.app/topic-02-side/unit-1/talk-1/talk.png",
        title: "Lecture 3",
        courseTitle: "Reference Course",
        loRoute: "/talk/reference-course/topic-02-side/unit-1/talk-1",
        user: getTestUser(),
        isPrivate: false
    };
    return lo;
}