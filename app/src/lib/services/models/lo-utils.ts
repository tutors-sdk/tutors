import type { Lo, Composite, Talk, LoType, Course, Topic, IconNav, Calendar, WeekType } from "./lo-types";

export function filterByType(list: Lo[], type: LoType): Lo[] {
  const los = flattenLos(list);
  return los.filter((lo) => lo.type === type);
}

export function injectCourseUrl(lo: Lo, id: string, url: string) {
  if (lo.type === "archive" || lo.type === "otherType") {
    lo.route = lo.route?.replace("{{COURSEURL}}", url);
  } else {
    lo.route = lo.route?.replace("{{COURSEURL}}", id);
  }

  lo.img = lo.img?.replace("{{COURSEURL}}", url);
  lo.video = lo.video?.replace("{{COURSEURL}}", id);
  if (lo.type == "talk" || lo.type == "paneltalk") {
    const talk = lo as Talk;
    talk.pdf = talk.pdf?.replace("{{COURSEURL}}", url);
  }
  if ("los" in lo) {
    // @ts-ignore
    lo.los.forEach((childLo) => {
      injectCourseUrl(childLo, id, url);
    });
  }
}

export function createToc(course: Course) {
  course.los.forEach((lo) => {
    const topic = lo as Topic;
    topic.toc = [];
    topic.toc.push(...topic.panels.panelVideos, ...topic.panels.panelTalks, ...topic.panels.panelNotes, ...topic.units.units, ...topic.units.standardLos, ...topic.units.sides);

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
  });
}

export function createCompanions(course: Course) {
  course.companions = {
    show: true,
    bar: []
  };
  const companionsList = [
    { key: "slack", icon: "slack", target: "_blank", tip: "Go to module Slack channel" },
    { key: "zoom", icon: "zoom", target: "_blank", tip: "Go to module Zoom meeting" },
    { key: "moodle", icon: "moodle", target: "_blank", tip: "Go to module Moodle page" },
    { key: "youtube", icon: "youtube", target: "_blank", tip: "Go to module YouTube channel" },
    { key: "teams", icon: "teams", target: "_blank", tip: "Go to module Teams meeting" }
  ];
  companionsList.forEach((companionItem) => {
    const { key, icon, target, tip } = companionItem;
    if (course.properties[key]) {
      course.companions.bar.push({ link: course.properties[key], icon, target, tip });
    }
  });
  if (course.properties.companions) {
    for (const [key, value] of Object.entries(course.properties.companions)) {
      const companion: any = value;
      course.companions.bar.push({
        link: companion.link,
        icon: key,
        target: "_blank",
        tip: companion.title
      });
    }
  }
  course.companions.show = course.companions.bar.length > 0;
}

export function createWallBar(course: Course) {
  course.wallBar = {
    show: true,
    bar: []
  };
  course.walls?.forEach((wall) => {
    course.wallBar.bar.push(createWallLink(wall[0].type, course));
  });
}

function createWallLink(type: string, course: Course): IconNav {
  return {
    link: `/wall/${type}/${course.courseUrl}`,
    icon: type,
    tip: `${type}s`,
    target: ""
  };
}

export function flattenLos(los: Lo[]): Lo[] {
  let result: Lo[] = [];
  los.forEach((lo) => {
    result.push(lo);
    if ("los" in lo) {
      // @ts-ignore
      result = result.concat(flattenLos(lo.los));
    }
  });
  return result;
}

export function allVideoLos(los: Lo[]): Lo[] {
  const allVideoLos: Lo[] = [];
  for (const lo of los) {
    if (lo.video) {
      allVideoLos.push(lo);
    }
  }
  return allVideoLos;
}

export function removeLeadingHashes(str: string): string {
  const hashIndex = str.lastIndexOf("#");
  return hashIndex >= 0 ? str.substring(hashIndex + 1) : str;
}

export function fixRoutePaths(lo: Lo) {
  if (lo.route && lo.route[0] === "#") {
    lo.route = "/" + lo.route.slice(1);
  }
  if (lo.video && lo.video[0] === "#") {
    lo.video = "/" + lo.video.slice(1);
  }
  if (lo.route.endsWith("md") && lo.video) {
    lo.route = lo.video;
  }
}

export function loadPropertyFlags(course: Course) {
  course.isPortfolio = (course.properties?.portfolio as unknown as boolean) === true;
  course.areVideosHidden = (course.properties?.hideVideos as unknown as boolean) === true;
  course.areLabStepsAutoNumbered = (course.properties?.labStepsAutoNumber as unknown as boolean) === true;
  course.authLevel = course.properties.auth as unknown as number;
  course.hasEnrollment = false;
  course.hasWhiteList = false;
  course.ignorePin = course.properties?.ignorepin?.toString();
}

export function initCalendar(course: Course) {
  const calendar = {
    title: "unknown",
    weeks: []
  };
  try {
    if (course.calendar) {
      const calendarObj = course.calendar;
      calendar.title = calendarObj.title;
      calendar.weeks = calendarObj.weeks.map((weekObj: any) => ({
        date: Object.keys(weekObj)[0],
        title: weekObj[Object.keys(weekObj)[0]].title,
        type: weekObj[Object.keys(weekObj)[0]].type,
        dateObj: new Date(Object.keys(weekObj)[0])
      }));

      const today = Date.now();
      const currentWeek = calendar.weeks.find((week, i) => today > Date.parse(week.date) && today <= Date.parse(calendar.weeks[i + 1]?.date));
      //course.calendar.weeks = calendar.weeks;
      course.courseCalendar = {
        title: calendarObj.title,
        weeks: calendar.weeks,
        currentWeek: currentWeek
      };
    }
  } catch (e) {
    console.log("Error loading calendar");
  }
}
