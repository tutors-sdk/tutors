import type { Course, Lo } from "$lib/services/models/lo-types";
import { flattenLos } from "$lib/services/models/lo-utils";
import type { LoEvent, LoUser } from "$lib/services/types/presence";

// Generate a fake LoEvent for the student from the course
export function generateLoEvent(student: LoUser, course: Course): LoEvent | null {
  // Extract all Los from a course - we are looking for not just within the topcis,
  // but from all Los throughout the recursive course structure
  const allLos = flattenLos(course.los);

  // Manufacturing an event is a little convoluted..
  let numberofTries = 12;
  do {
    // pick an lo at random
    let index = Math.floor(Math.random() * allLos.length);
    const lo = allLos[index];

    if (lo.img && lo.title) {
      // the Lo seems valid so lets run with it
      return {
        courseId: course.id,
        courseUrl: course.route,
        title: course.title,
        courseTitle: lo.title,
        img: lo.img,
        loRoute: lo.route,
        user: student,
        type: lo.type,
        isPrivate: true
      };
    } else {
      // Not a usable Lo - except if it is a lab step
      if (lo.type == "step") {
        return {
          courseId: course.id,
          courseUrl: course.route,
          title: lo.title,
          courseTitle: course.title,
          img: lo.parentLo?.img!,
          loRoute: lo.route,
          user: student,
          type: "lab",
          isPrivate: true
        };
      }
    }
    // keep trying until we run our of tries
    numberofTries--;
  } while (numberofTries);
  return null;
}
