import { allLos, allVideoLos, flattenLos, getSortedUnits, injectCourseUrl, threadLos } from "../utils/lo-utils";
import { Topic } from "./topic";
import { addIcon } from "../iconography/themes";
export class Course {
    lo;
    topics = [];
    units;
    standardLos;
    allLos;
    url = "";
    authLevel = 0;
    topicIndex = new Map();
    hydratedLabs = new Map();
    walls = new Map();
    calendar;
    currentWeek = null;
    loIndex = new Map();
    companions = {
        show: true,
        bar: [],
    };
    wallBar = {
        show: true,
        bar: [],
    };
    constructor(lo, courseId) {
        this.url = courseId;
        injectCourseUrl(lo, courseId);
        if (lo.properties.hasOwnProperty("auth"))
            this.authLevel = lo.properties.auth;
        threadLos(lo);
        lo.route = `/#/course/${courseId}`;
        this.lo = lo;
        this.initCalendar();
        if (lo.properties.icon) {
            lo.icon = lo.properties.icon;
        }
        this.allLos = this.lo.los;
        this.lo.los = this.lo.los.filter((lo) => lo.hide != true);
        this.populate();
        this.createCompanions();
        this.createWallBar();
    }
    populate() {
        for (let lo of this.lo.los) {
            const topic = new Topic(lo, this.url, this);
            this.topics.push(topic);
            this.topicIndex.set(lo.id, topic);
        }
        let los = flattenLos(this.lo.los);
        for (let lo of los) {
            this.loIndex.set(lo.route, lo);
        }
        if (!this.areVideosHidden()) {
            const videoLos = allVideoLos(this.lo.los);
            videoLos.forEach((lo) => {
                this.loIndex.set(lo.video, lo);
            });
            if (videoLos.length > 0) {
                this.walls.set("video", videoLos);
            }
        }
        this.addWall("talk");
        this.addWall("note");
        this.addWall("lab");
        this.addWall("github");
        this.addWall("archive");
        this.units = getSortedUnits(this.lo.los);
        this.standardLos = this.lo.los.filter((lo) => lo.type !== "unit" && lo.type !== "panelvideo" && lo.type !== "paneltalk");
    }
    addWall(type) {
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
        let isPortfolio = false;
        if (this?.lo?.properties?.portfolio !== undefined) {
            const portfolio = this.lo.properties.portfolio;
            isPortfolio = portfolio == true;
        }
        return isPortfolio;
    }
    areVideosHidden() {
        let videosHidden = false;
        if (this.lo.properties.hideVideos !== undefined) {
            let hideVideos = this.lo.properties.hideVideos;
            videosHidden = hideVideos == true;
        }
        return videosHidden;
    }
    areLabStepsAutoNumbered() {
        let labStepsAutoNumber = false;
        if (this.lo.properties.labStepsAutoNumber !== undefined) {
            let labStepsAutoNumberProp = this.lo.properties.labStepsAutoNumber;
            labStepsAutoNumber = labStepsAutoNumberProp == true;
        }
        return labStepsAutoNumber;
    }
    hasEnrollment() {
        return this?.lo?.enrollment !== undefined;
    }
    hasWhiteList() {
        let whitelist = false;
        if (this.lo.properties.whitelist !== undefined && this.authLevel > 0) {
            const whitelistProp = this.lo.properties.whitelist;
            whitelist = whitelistProp == 1;
        }
        return this.hasEnrollment() && whitelist;
    }
    getStudents() {
        return this.lo.enrollment.students;
    }
    createCompanions() {
        const properties = this.lo.properties;
        if (properties.slack)
            this.companions.bar.push({
                link: properties["slack"],
                icon: "slack",
                target: "_blank",
                tip: "Go to module Slack channel",
            });
        if (properties.zoom)
            this.companions.bar.push({
                link: properties["zoom"],
                icon: "zoom",
                tip: "Go to module Zoom meeting",
                target: "_blank",
            });
        if (properties.moodle)
            this.companions.bar.push({
                link: properties["moodle"],
                icon: "moodle",
                target: "_blank",
                tip: "Go to module Moodle page",
            });
        if (properties.youtube)
            this.companions.bar.push({
                link: properties["youtube"],
                icon: "youtube",
                target: "_blank",
                tip: "Go to module YouTube channel",
            });
        if (properties.teams)
            this.companions.bar.push({
                link: properties["teams"],
                icon: "teams",
                target: "_blank",
                tip: "Go to module Teams meeting",
            });
        if (properties.companions) {
            for (let [key, value] of Object.entries(properties.companions)) {
                const companion = value;
                addIcon(key, companion.icon);
                this.companions.bar.push({
                    link: companion.link,
                    icon: key,
                    target: "_blank",
                    tip: companion.title,
                });
            }
        }
        this.companions.show = this.companions.bar.length > 0;
    }
    createWallBar() {
        if (!this.isPortfolio()) {
            this.walls.forEach((los, type) => {
                this.wallBar.bar.push(this.createWallLink(type));
                this.wallBar.show = true;
            });
        }
    }
    createWallLink(type) {
        return {
            link: `/#/wall/${type}/${this.url}`,
            icon: type,
            tip: `${type}s`,
            target: "",
        };
    }
    initCalendar() {
        const calendar = {
            title: "unknown",
            weeks: [],
        };
        this.calendar = calendar;
        try {
            if (this.lo.calendar) {
                const calendarObj = this.lo.calendar;
                calendar.title = calendarObj.title;
                for (let i = 0; i < calendarObj.weeks.length; i++) {
                    const week = {
                        date: Object.entries(calendarObj.weeks[i])[0][0],
                        // @ts-ignore
                        title: Object.entries(calendarObj.weeks[i])[0][1].title,
                        // @ts-ignore
                        type: Object.entries(calendarObj.weeks[i])[0][1].type,
                        dateObj: new Date(Object.entries(calendarObj.weeks[i])[0][0]),
                    };
                    calendar.weeks.push(week);
                }
                const today = Date.now();
                for (let i = 0; i < calendar.weeks.length - 1; i++) {
                    if (today > Date.parse(calendar.weeks[i].date) && today <= Date.parse(calendar.weeks[i + 1].date)) {
                        this.currentWeek = calendar.weeks[i];
                    }
                }
            }
        }
        catch (e) {
            console.log("Error loading calendar");
        }
    }
}
//# sourceMappingURL=course.js.map