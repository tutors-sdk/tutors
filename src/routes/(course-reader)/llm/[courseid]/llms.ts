import type { Course, Lo, Topic } from "$lib/services/base";
import { filterByType, flattenLos, getVideoConfig } from "$lib/services/course/utils/lo-utils";
import { convertMdToHtml } from "$lib/services/markdown";

export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

const llmsText = "text in markdown";
const pdfsZip = "archive of pdfs";
const videoTxt = "video";

function courseSummary(course: Course): string {
  const fileName = toSnakeCase(course.title);
  let links:string[] = [];
  links.push(`- [${fileName}-complete-llms.txt](https://${course.courseUrl}/llms/${fileName}-complete-llms.txt) — ${llmsText}`);
  const talks = filterByType(course.los, "talk");
  if (talks.length > 0) {
    links.push(`- [${fileName}-complete-pdfs.zip](https://${course.courseUrl}/llms/${fileName}-complete-pdfs.zip) — ${pdfsZip}`);
  }
  return links.join("\n");
}

function topics(course: Course): string {
  let topicStr:string[] = [];
  const topicLos = filterByType(course.los, "topic");
  topicLos.forEach((lo: Lo, index: number) => {
    if (lo.type === "topic" && lo.hide !== true) {
      const topic = lo as Topic;
      const paddedIndex = index.toString().padStart(2, "0");
      const title = `${paddedIndex}-${toSnakeCase(topic.title)}`;
      topicStr.push(`### ${topic.title}`);
      topicStr.push(
        `- [${toSnakeCase(topic.title)}-llms.txt](https://${course.courseUrl}/llms/topics/${title}-llms.txt) — ${llmsText}`
      );
      topicStr.push(
        `- [${toSnakeCase(topic.title)}-pdfs.zip](https://${course.courseUrl}/llms/topics/${title}-pdfs.zip) — ${pdfsZip}`
      );

      const allLos = flattenLos(topic.los);
      const videos = allLos.filter((lo) => lo.type === "panelvideo");
      videos.forEach((video: Lo) => {
        const videoConfig = getVideoConfig(video);
        if (videoConfig.externalUrl) {
          topicStr.push(`- [${video.title}](${videoConfig.externalUrl}) — ${videoTxt}`);
        }
      });
    }
  });
  let str = "";
  if (topicStr.length > 0) {
    str = "\n\nFor some LLMs it may make sense to provide individual topic content, which can be found below:\n" + topicStr.join("\n");
  }
  return str;
}

export function generateLlms(course: Course): string {
  const summary = courseSummary(course);
  const topicStr = topics(course);
  return convertMdToHtml(summary + topicStr);
}
