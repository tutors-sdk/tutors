import type { Course } from "$lib/services/models/lo-types";
import { flattenLos } from "$lib/services/models/lo-utils";
import type { LoEvent, LoUser } from "$lib/services/types/presence";

export function generateLoEvent(student: LoUser, course: Course): LoEvent {
  const loEvent: LoEvent = {
    courseId: course.id,
    courseUrl: course.route,
    img: course.img,
    title: course.title,
    courseTitle: course.title,
    loRoute: course.route,
    user: student,
    type: "",
    isPrivate: course.isPrivate
  };
  const allLos = flattenLos(course.los);

  let stillLookingForLo = true;
  do {
    let index = Math.floor(Math.random() * allLos.length);
    const childLo = allLos[index];
    loEvent.type = childLo.type;
    if (childLo.img && childLo.title) {
      const route = childLo.route.replace("{{COURSEURL}}", course.courseId);
      loEvent.loRoute = `${route}`;
      loEvent.title = childLo.title;
      loEvent.img = childLo.img.replace("{{COURSEURL}}", `${course.courseId}.netlify.app`);
      stillLookingForLo = false;
    } else {
      if (childLo.type == "step") {
        const route = childLo.route.replace("{{COURSEURL}}", course.courseId);
        loEvent.loRoute = `${route}`;
        loEvent.title = childLo.title;
        loEvent.img = childLo.parentLo?.img.replace("{{COURSEURL}}", `${course.courseId}.netlify.app`);
        stillLookingForLo = false;
        loEvent.type = "lab";
      }
    }
  } while (stillLookingForLo);
  return loEvent;
}
