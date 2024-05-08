import type { Course } from "$lib/services/models/lo-types";
import type { IconType } from "$lib/services/models/lo-types";
import type { Lo } from "$lib/services/models/lo-types";
import { writeObj } from "$lib/services/utils/firebase";
import type { Session } from "@supabase/supabase-js";

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
  return !invalidPatterns.test(course);
}

export async function getCourseSummary(courseId: string): Promise<CourseSummary> {
  const response = await fetch(`https://${courseId}.netlify.app/tutors.json`);
  const lo = await response.json();
  const courseUrl = `${courseId}.netlify.app`;

  return {
    title: lo.title.trim(),
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

export function updateLo(root: string, course: Course, currentLo: Lo, onlineStatus: boolean, session: Session) {
  const lo: any = {
    img: currentLo.img,
    title: currentLo.title,
    courseTitle: course.title,
    subRoute: currentLo.route,
    isPrivate: course.properties?.private ? course.properties.private : 0
  };
  if (session && onlineStatus) {
    const name = session.user.user_metadata.full_name ? session.user.user_metadata.full_name : session.user.user_metadata.user_name;
    const user = {
      fullName: name,
      avatar: session.user.user_metadata.avatar_url,
      id: session.user.user_metadata.user_name
    };
    lo.user = user;
  } else {
    const user = {
      fullName: "anonymous",
      avatar: "none",
      id: getTutorsTimeId()
    };
    lo.user = user;
  }
  if (currentLo.icon) {
    const icon = {
      icon: currentLo.icon.type
    };
    if (currentLo.icon.color !== undefined) icon.color = currentLo.icon.color;
    lo.icon = icon;
  }
  writeObj(`${root}/learningEvent`, lo);
}

function generateTutorsTimeId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getTutorsTimeId() {
  if (!window.localStorage.tutorsTimeId) {
    window.localStorage.tutorsTimeId = generateTutorsTimeId();
  }
  return window.localStorage.tutorsTimeId;
}
