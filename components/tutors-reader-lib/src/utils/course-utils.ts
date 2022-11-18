import type { Course } from "src/models/course";
import type { Lo } from "src/types/lo-types";
import { writeObj } from "./firebase-utils";

export function isValidCourseName(course: string) {
  let isValid = true;
  if (course.length > 27 && course[24] == "-" && course[25] == "-") {
    isValid = false;
  } else {
    if (course.startsWith("main--") || course.startsWith("master--")) {
      isValid = false;
    }
    if (course.startsWith("deploy-preview")) {
      isValid = false;
    }
  }
  return isValid;
}

export async function getCourseSummary(courseId: string): Promise<Lo> {
  const response = await fetch(`https://${courseId}.netlify.app/tutors.json`);
  const lo = await response.json();
  lo.type = "web";
  lo.route = `https://reader.tutors.dev//#/course/${courseId}.netlify.app`;
  lo.img = lo.img.replace("{{COURSEURL}}", `${courseId}.netlify.app`);
  if (lo.properties.icon) {
    lo.icon = lo.properties.icon;
  }
  return lo;
}

export function updateLo(root: string, course: Course, currentLo: Lo) {
  const lo = {
    icon: {},
    img: currentLo.img,
    title: currentLo.title,
    courseTitle: course.lo.title,
    subRoute: currentLo.route,
    isPrivate: 0,
    tutorsTimeId: getTutorsTimeId(),
  };
  if (currentLo.type === "course" && currentLo.icon) {
    lo.icon = currentLo.icon;
  } else {
    if (currentLo?.frontMatter?.icon) {
      lo.icon = {
        type: currentLo.frontMatter.icon["type"],
      };
      if (currentLo.frontMatter.icon["color"]) {
        lo.icon.color = currentLo.frontMatter.icon["color"];
      }
    }
  }
  if (course.lo.properties?.private) {
    lo.isPrivate = course.lo.properties?.private as unknown as number;
  }

  writeObj(`${root}/lo`, lo);
}

function generateTutorsTimeId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getTutorsTimeId() {
  if (window.localStorage.tutorsTimeId != null) {
    return window.localStorage.tutorsTimeId;
  } else {
    window.localStorage.tutorsTimeId = generateTutorsTimeId();
    return window.localStorage.tutorsTimeId;
  }
}
