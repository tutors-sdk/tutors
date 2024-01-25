import { courseService } from "$lib/services/course";
import type { Course } from "$lib/services/models/lo-types";
import type { LoUser } from "$lib/services/types/presence";
import { generateLoEvent } from "./generateLo";
import { generateStudent } from "./generateStudent";
import { presenceSimulatorService } from "./presence-simulator";

export const presenceGeneratorService = {
  students: new Array<LoUser>(),
  courses: new Array<Course>(),
  simulation: new Map<string, Course>(),
  intervalId: 0,

  async initialise(courseIds: string[], numberStudents: number) {
    for (let i = 0; i < numberStudents; i++) {
      this.students.push(generateStudent());
    }

    for (let i = 0; i < courseIds.length; i++) {
      let course = await courseService.getOrLoadCourse(courseIds[i], fetch).catch();
      this.courses.push(course);
    }

    for (let i = 0; i < numberStudents; i++) {
      this.simulation.set(this.students[i].id, this.courses[Math.floor(Math.random() * this.courses.length)]);
    }
  },

  start(interval: number) {
    // @ts-ignore
    this.intervalId = setInterval(() => {
      presenceGeneratorService.event();
    }, interval);
  },

  stop() {
    clearInterval(this.intervalId);
  },

  event() {
    const student = this.students[Math.floor(Math.random() * this.students.length)];
    const course = this.simulation.get(student.id);
    if (course) {
      const loEvent = generateLoEvent(student, course);
      presenceSimulatorService.simulateLoEvent(loEvent);
    }
  }
};
