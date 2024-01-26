import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import type { LoUser } from "$lib/services/types/presence";
import { generateLoEvent } from "./generateLo";
import { generateStudent } from "./generateStudent";
import { partykitGateway } from "./partykit-gateway";

// The heart of the simulation
export const presenceServiceSimulator = {
  // the students for the simulation
  students: new Array<LoUser>(),
  // the course for the simulation
  courses: new Array<Course>(),
  // the students and the course they are interacting with
  simulation: new Map<string, Course>(),
  // timout handle for stopping the simulation timer
  intervalId: 0,

  async initialise(courseIds: string[], numberStudents: number) {
    // Create the fake students
    for (let i = 0; i < numberStudents; i++) {
      this.students.push(generateStudent());
    }

    // Load all the courses
    for (let i = 0; i < courseIds.length; i++) {
      let course = await courseService.getOrLoadCourse(courseIds[i], fetch).catch();
      this.courses.push(course);
    }

    // Assign student to course randomly
    for (let i = 0; i < numberStudents; i++) {
      this.simulation.set(this.students[i].id, this.courses[Math.floor(Math.random() * this.courses.length)]);
    }
  },

  // Start the simulation, setting a timer to invoke the event function
  start(interval: number) {
    // @ts-ignore
    this.intervalId = setInterval(() => {
      this.event();
    }, interval);
  },

  // stop the simulation
  stop() {
    clearInterval(this.intervalId);
  },

  // To be called for every event
  event() {
    // Get a random student;
    const student = this.students[Math.floor(Math.random() * this.students.length)];
    // Get the course the student is interacting with
    const course = this.simulation.get(student.id);
    if (course) {
      // Generate an event
      const loEvent = generateLoEvent(student, course);
      if (loEvent) {
        // Send the event to Partykit
        partykitGateway.sendLoEvent(loEvent);
      }
    }
  }
};
