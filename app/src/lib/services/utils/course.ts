import type { Course } from "$lib/services/models/course";
import type { IconType } from "$lib/services/types/icon";
import type { Lo } from "$lib/services/types/lo";
import { writeObj } from "$lib/services/utils/firebase";

export interface CourseSummary {
  title: string;
  visits: number;
  count: number;
  img: string;
  icon: IconType;
  route: string;
  isPrivate: boolean;
  currentLo: any;
  studentIds: Set<string>;
}

export function isValidCourseName(course: string) {
  const invalidPatterns = /^(main--|master--|deploy-preview--)|-{2}/;
  return !invalidPatterns.test(course) && course.length <= 27;
}

export async function getCourseSummary(courseId: string): Promise<CourseSummary> {
  const response = await fetch(`https://${courseId}.netlify.app/tutors.json`);
  const lo = await response.json();
  const courseUrl = `${courseId}.netlify.app`;

  return {
    title: lo.title,
    img: lo.img.replace("{{COURSEURL}}", courseUrl),
    icon: lo.properties?.icon,
    route: `https://tutors.dev/course/${courseUrl}`,
    visits: 0,
    count: 0,
    isPrivate: lo.properties?.private,
    currentLo: null,
    studentIds: new Set<string>()
  };
}

export function updateLo(root: string, course: Course, currentLo: Lo) {
  const lo = {
    icon:
      currentLo.type === "course"
        ? currentLo.icon
        : currentLo.frontMatter?.icon
        ? { type: currentLo.frontMatter.icon["type"], color: currentLo.frontMatter.icon["color"] }
        : {},
    img: currentLo.img,
    title: currentLo.title,
    courseTitle: course.lo.title,
    subRoute: currentLo.route,
    isPrivate: course.lo.properties?.private ? course.lo.properties.private : 0,
    tutorsTimeId: getTutorsTimeId(course)
  };

  writeObj(`${root}/lo`, lo);
}

function generateTutorsTimeId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getTutorsTimeId(course: Course) {
  if (course.authLevel > 0) {
    return window.localStorage.id;
  }

  if (!window.localStorage.tutorsTimeId) {
    window.localStorage.tutorsTimeId = generateTutorsTimeId();
  }

  return window.localStorage.tutorsTimeId;
}
