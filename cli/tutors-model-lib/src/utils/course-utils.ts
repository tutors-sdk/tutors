// import { themeService } from "$lib/services/themes/services/themes.svelte";
import type { Composite, Course, IconNav, Lo, LoType, Topic } from "../types/index.ts";
import { filterByType, setShowHide } from "../utils/lo-utils.ts";

export function createToc(course: Course) {
  course.los.forEach((lo) => {
    if (lo.type == "topic") {
      const topic = lo as Topic;
      topic.toc = [];
      topic.toc.push(
        ...topic.panels.panelVideos,
        ...topic.panels.panelTalks,
        ...topic.panels.panelNotes,
        ...topic.units.units,
        ...topic.units.standardLos,
        ...topic.units.sides,
      );

      topic.toc.forEach((lo) => {
        lo.parentLo = course;
        lo.parentTopic = topic;
        if (lo.type === "unit" || lo.type === "side") {
          const composite = lo as Composite;
          composite.los.forEach((subLo) => {
            subLo.parentTopic = topic;
          });
        }
      });
    }
  });
}

export function createCompanions(course: Course) {
  course.companions = {
    show: true,
    bar: [],
  };
  const companionsList = [
    {
      key: "slack",
      type: "slack",
      target: "_blank",
      tip: "Go to module Slack channel",
    },
    {
      key: "zoom",
      type: "zoom",
      target: "_blank",
      tip: "Go to module Zoom meeting",
    },
    {
      key: "moodle",
      type: "moodle",
      target: "_blank",
      tip: "Go to module Moodle page",
    },
    {
      key: "youtube",
      type: "youtube",
      target: "_blank",
      tip: "Go to module YouTube channel",
    },
    {
      key: "teams",
      type: "teams",
      target: "_blank",
      tip: "Go to module Teams meeting",
    },
  ];
  companionsList.forEach((companionItem) => {
    const { key, type, target, tip } = companionItem;
    if (course.properties[key]) {
      course.companions.bar.push({
        link: course.properties[key],
        type,
        target,
        tip,
      });
    }
  });
  if (course.properties.companions) {
    for (const [key, value] of Object.entries(course.properties.companions)) {
      const companion: any = value;
      // themeService.addIcon(key, companion.icon);
      course.companions.bar.push({
        link: companion.link,
        type: key,
        target: "_blank",
        tip: companion.title,
      });
    }
  }
  course.companions.show = course.companions.bar.length > 0;
}

export function createWalls(course: Course) {
  course.walls = [];
  course.wallMap = new Map<string, Lo[]>();
  ["talk", "note", "lab", "web", "archive", "github"].forEach((type) => addWall(course, type as LoType));
  course.wallBar = {
    show: true,
    bar: [],
  };
  course.walls?.forEach((wall) => {
    course.wallBar.bar.push(createWallLink(wall[0].type, course));
  });
}

function createWallLink(type: string, course: Course): IconNav {
  return {
    link: `/wall/${type}/${course.courseId}`,
    type: type,
    tip: `All ${type}s in the course`,
    target: "",
  };
}

function addWall(course: Course, type: LoType) {
  let los = filterByType(course.los, type);
  los = los.filter((lo) => lo.hide === false);
  if (los.length > 0) {
    course.walls?.push(filterByType(course.los, type));
  }
  if (los.length > 0) {
    course.wallMap?.set(type, los);
  }
}

export function loadPropertyFlags(course: Course) {
  course.isPortfolio = (course.properties?.portfolio as unknown as boolean) === true;
  course.llm = course.properties?.llm as unknown as number;
  course.isPrivate = (course.properties?.private as unknown as number) === 1;
  course.areVideosHidden = (course.properties?.hideVideos as unknown as boolean) === true;
  course.footer = course.properties?.footer as unknown as string;
  course.areLabStepsAutoNumbered = (course.properties?.labStepsAutoNumber as unknown as boolean) === true;
  course.authLevel = course.properties?.auth as unknown as number;
  course.defaultPdfReader = "adobe";
  if (course.properties?.defaultPdfReader) {
    course.defaultPdfReader = course.properties.defaultPdfReader;
  }
  course.pdfOrientation = "landscape";
  if (course.properties?.pdfOrientation) {
    course.pdfOrientation = course.properties.pdfOrientation;
  }
  if (course.enrollment) {
    course.hasEnrollment = true;
  }
  if (course.calendar) {
    course.hasCalendar = true;
  }

  course.hasWhiteList = false;
  course.ignorePin = course.properties?.ignorepin?.toString();
  if (course.properties?.icon && typeof course.properties.icon === "object") {
    const icon = course.properties.icon as { type?: string; color?: string };
    if (icon.type && icon.color) {
      course.icon = {
        type: icon.type,
        color: icon.color,
      };
    }
  }
  course.los.forEach((lo) => {
    if (lo.hide) {
      setShowHide(lo, true);
    }
  });
}

export function initCalendar(course: Course) {
  const calendar: { title: string; weeks: Array<{ date: string; title: string; type: string; dateObj: Date }> } = {
    title: "unknown",
    weeks: [],
  };
  try {
    if (course.calendar) {
      const calendarObj = course.calendar;
      calendar.title = calendarObj.title;
      if (Array.isArray(calendarObj.weeks)) {
        calendar.weeks = calendarObj.weeks.map((weekObj: Record<string, { title: string; type: string }>) => {
          const date = Object.keys(weekObj)[0];
          const weekData = weekObj[date];
          return {
            date,
            title: weekData.title,
            type: weekData.type,
            dateObj: new Date(date),
          };
        });
      }

      const today = Date.now();
      const currentWeek = calendar.weeks.find(
        (week, i) =>
          today > Date.parse(week.date) &&
          today <= Date.parse(calendar.weeks[i + 1]?.date),
      );
      course.courseCalendar = {
        title: calendarObj.title,
        weeks: calendar.weeks,
        currentWeek: currentWeek,
      };
    }
  } catch (_e) {
    console.log("Error loading calendar");
  }
}
