import type { Calendar, Lo, WeekType } from "$lib/services/types/lo";
import {
  allLos,
  allVideoLos,
  flattenLos,
  getSortedUnits,
  injectCourseUrl,
  threadLos
} from "$lib/services/utils/lo";
import { Topic } from "$lib/services/models/topic";
import type { IconNav, IconNavBar } from "$lib/services/types/icon";
import { addIcon } from "$lib/ui/legacy/Atoms/Icon/themes";

export class Course {
  url = "";
  id = "";
  lo: Lo;
  topics: Topic[] = [];
  units: Lo[];
  sideBar: Lo[];
  standardLos: Lo[];
  allLos: Lo[];
  authLevel = 0;
  topicIndex = new Map<string, Topic>();
  hydratedLabs = new Map<string, any>();
  walls = new Map<string, Lo[]>();
  calendar: Calendar;
  currentWeek: WeekType = null;
  loIndex = new Map<string, Lo>();

  companions: IconNavBar = {
    show: true,
    bar: []
  };
  wallBar: IconNavBar = {
    show: true,
    bar: []
  };

  constructor(lo: Lo, courseId: string, courseUrl: string) {
    this.id = courseId;
    this.url = courseUrl;
    injectCourseUrl(lo, courseId, courseUrl);
    if (lo.properties?.auth !== undefined) {
      this.authLevel = lo.properties.auth as unknown as number;
    }
    threadLos(lo);
    lo.route = `/course/${courseId}`;
    this.lo = lo;
    this.initCalendar();
    if (lo.properties?.icon) {
      lo.icon = lo.properties.icon;
    }
    this.allLos = this.lo.los;
    this.lo.los = this.lo.los.filter((lo) => lo.hide !== true);
    this.populate();
    this.createCompanions();
    this.createWallBar();
  }

  populate() {
    this.topics = this.lo.los.map((lo) => {
      const topic = new Topic(lo, this.url, this);
      this.topicIndex.set(lo.id, topic);
      return topic;
    });
    const los = flattenLos(this.lo.los);
    los.forEach((lo) => this.loIndex.set(lo.route, lo));
    if (!this.areVideosHidden()) {
      const videoLos = allVideoLos(this.lo.los);
      videoLos.forEach((lo) => this.loIndex.set(lo.video, lo));
      if (videoLos.length > 0) {
        this.walls.set("video", videoLos);
      }
    }
    ["talk", "note", "lab", "web", "archive", "github"].forEach((type) => this.addWall(type));
    this.units = getSortedUnits(this.lo.los);
    this.sideBar = this.lo.los.filter((lo) => lo.type === "side");
    this.standardLos = this.lo.los.filter(
      (lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk"
    );
  }

  addWall(type: string) {
    const los = allLos(type, this.lo.los);
    if (los.length > 0) {
      this.walls.set(type, los);
    }
  }

  showAllLos() {
    this.lo.los = this.allLos;
    this.populate();
  }

  isPortfolio() {
    return !!this?.lo?.properties?.portfolio;
  }

  areVideosHidden(): boolean {
    return !!this.lo?.properties?.hideVideos && this.lo.properties.hideVideos !== "false";
  }

  areLabStepsAutoNumbered(): boolean {
    let labStepsAutoNumber = false;
    if (this.lo.properties.labStepsAutoNumber !== undefined) {
      const labStepsAutoNumberProp: any = this.lo.properties.labStepsAutoNumber;
      labStepsAutoNumber = labStepsAutoNumberProp == true;
    }
    return labStepsAutoNumber;
  }

  hasEnrollment(): boolean {
    return this?.lo?.enrollment !== undefined;
  }

  hasWhiteList(): boolean {
    const whitelistProp = this.lo?.properties?.whitelist;
    return this.hasEnrollment() && Number(whitelistProp) === 1;
  }

  getEnrolledStudentIds(): string[] {
    return this.lo.enrollment;
  }

  createCompanions() {
    const { properties } = this.lo;
    const companionsList = [
      { key: "slack", icon: "slack", target: "_blank", tip: "Go to module Slack channel" },
      { key: "zoom", icon: "zoom", target: "_blank", tip: "Go to module Zoom meeting" },
      { key: "moodle", icon: "moodle", target: "_blank", tip: "Go to module Moodle page" },
      { key: "youtube", icon: "youtube", target: "_blank", tip: "Go to module YouTube channel" },
      { key: "teams", icon: "teams", target: "_blank", tip: "Go to module Teams meeting" }
    ];
    companionsList.forEach((companionItem) => {
      const { key, icon, target, tip } = companionItem;
      if (properties[key]) {
        this.companions.bar.push({ link: properties[key], icon, target, tip });
      }
    });
    if (properties.companions) {
      for (const [key, value] of Object.entries(properties.companions)) {
        const companion: any = value;
        addIcon(key, companion.icon);
        this.companions.bar.push({
          link: companion.link,
          icon: key,
          target: "_blank",
          tip: companion.title
        });
      }
    }
    this.companions.show = this.companions.bar.length > 0;
  }

  createWallBar() {
    if (!this.isPortfolio()) {
      this.wallBar.bar = Array.from(this.walls.keys()).map((type) => this.createWallLink(type));
      this.wallBar.show = this.wallBar.bar.length > 0;
    }
  }

  createWallLink(type: string): IconNav {
    return {
      link: `/wall/${type}/${this.url}`,
      icon: type,
      tip: `${type}s`,
      target: ""
    };
  }

  initCalendar() {
    const calendar: Calendar = {
      title: "unknown",
      weeks: []
    };
    this.calendar = calendar;
    try {
      if (this.lo.calendar) {
        const calendarObj = this.lo.calendar;
        calendar.title = calendarObj.title;
        calendar.weeks = calendarObj.weeks.map((weekObj) => ({
          date: Object.keys(weekObj)[0],
          title: weekObj[Object.keys(weekObj)[0]].title,
          type: weekObj[Object.keys(weekObj)[0]].type,
          dateObj: new Date(Object.keys(weekObj)[0])
        }));

        const today = Date.now();
        this.currentWeek = calendar.weeks.find(
          (week, i) =>
            today > Date.parse(week.date) && today <= Date.parse(calendar.weeks[i + 1]?.date)
        );
      }
    } catch (e) {
      console.log("Error loading calendar");
    }
  }
}
