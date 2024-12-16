import { courseUrl, currentCourse, currentLo } from "$lib/runes";
import type { Lo, Course, Lab, Note } from "$lib/services/models/lo-types";
import { decorateCourseTree } from "./models/lo-tree";
import { LiveLab } from "./models/live-lab";
import type { CourseService } from "./types.svelte";
import { markdownService } from "./markdown.svelte";
import { themeService } from "$lib/ui/themes/theme-controller.svelte";

export const courseService: CourseService = {
  courses: new Map<string, Course>(),
  labs: new Map<string, LiveLab>(),
  notes: new Map<string, Note>(),
  courseUrl: "",

  async getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    let course = this.courses.get(courseId);
    let courseUrl = courseId;

    function isValidURL(url: string) {
      const urlPattern =
        /^(https?:\/\/)?([A-Za-z0-9.-]+\.[A-Za-z]{2,})(:[0-9]+)?(\/[A-Za-z0-9_.-]+)*(\/[A-Za-z0-9_.-]+\?[A-Za-z0-9_=-]+)?(#.*)?$/;
      return urlPattern.test(url);
    }

    if (!course) {
      if (isValidURL(courseId)) {
        if (courseId.includes(".netlify.app")) {
          courseUrl = courseId;
          courseId = courseId.replace(".netlify.app", "");
        } else {
          courseUrl = courseId;
        }
      } else {
        courseUrl = `${courseId}.netlify.app`;
      }

      try {
        const response = await fetchFunction(`https://${courseUrl}/tutors.json`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        course = data as Course;
        decorateCourseTree(course, courseId, courseUrl);
        this.courses.set(courseId, course);
      } catch (error) {
        console.error(`Error fetching from URL: https://${courseUrl}/tutors.json`);
        console.error(error);
        throw error;
      }
    }

    return course;
  },

  async readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course> {
    const course = await this.getOrLoadCourse(courseId, fetchFunction);
    currentCourse.value = course;
    currentLo.value = course;
    courseUrl.value = course.courseUrl;
    // if (course.courseTheme) {
    //   themeService.setCourseTheme(course.courseTheme);
    // }
    return course;
  },

  async readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const topic = course.topicIndex.get(topicId);
    if (topic) currentLo.value = topic;
    return topic!;
  },

  async readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LiveLab> {
    const course = await this.readCourse(courseId, fetchFunction);

    const lastSegment = labId.substring(labId.lastIndexOf("/") + 1);
    if (!lastSegment.startsWith("book")) {
      labId = labId.slice(0, labId.lastIndexOf("/"));
    }

    let liveLab = this.labs.get(labId);
    if (!liveLab) {
      const lab = course.loIndex.get(labId) as Lab;
      markdownService.convertLabToHtml(course, lab);
      liveLab = new LiveLab(course, lab, labId);
      this.labs.set(labId, liveLab);
    }

    currentLo.value = liveLab.lab;
    return liveLab;
  },

  async readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]> {
    const course = await this.readCourse(courseId, fetchFunction);
    const wall = course.wallMap?.get(type);
    return wall!;
  },

  async readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo> {
    const course = await this.readCourse(courseId, fetchFunction);
    const lo = course.loIndex.get(loId);
    if (lo) currentLo.value = lo;
    if (lo?.type === "note") {
      markdownService.convertNoteToHtml(course, lo as Note);
      this.notes.set(loId, lo as Note);
    }
    return lo!;
  },

  refreshAllLabs() {
    for (const liveLab of this.labs.values()) {
      markdownService.convertLabToHtml(liveLab.course, liveLab.lab, true);
      liveLab.convertMdToHtml();
      liveLab.refreshStep();
    }
    for (const note of this.notes.values()) {
      markdownService.convertNoteToHtml(currentCourse.value!, note, true);
    }
  }
};
