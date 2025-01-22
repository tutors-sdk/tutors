import type { Course, Lo, Topic } from "$lib/services/base";
import { flattenLos, getVideoConfig } from "$lib/services/course/utils/lo-utils";
import { convertMdToHtml } from "$lib/services/markdown";

export function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
}

function getSummary(course: Course): string {
  const fileName = toSnakeCase(course.title);
  let text = `
## Docs for LLMs

Tutors supports the [llms.txt](https://llmstxt.org/) convention for making documentation available to large language models and the applications that make use of them.

### Complete Course Content

- [${fileName}-complete-llms.txt](https://${course.courseUrl}/llms/${fileName}-complete-llms.txt) — the complete course
- [${fileName}-complete-pdf.zip](https://${course.courseUrl}/llms/${fileName}-complete-pdfs.zip) — archive of all PDFs

`;
return text;
}

export function generateLlms(course: Course) : string {
  let text = getSummary(course);
  let topicStr: string[] = [];
  course.los.forEach((lo: Lo, index: number) => {
    if (lo.type === "topic") {
      const topic = lo as Topic;
      const paddedIndex = index.toString().padStart(2, "0");
      const title = `${paddedIndex}-${toSnakeCase(topic.title)}`;
      topicStr.push(`### ${topic.title}`);
      topicStr.push(`- [${toSnakeCase(topic.title)}-llms.txt](https://${course.courseUrl}/llms/topics/${title}-llms.txt)`);
      topicStr.push(`- [Archive of talks](https://${course.courseUrl}/llms/topics/${title}-pdfs.zip)`);

      const allLos = flattenLos(topic.los);
      const videos = allLos.filter((lo) => lo.type === "panelvideo");
      videos.forEach((video: Lo) => {
        const videoConfig = getVideoConfig(video);
        if (videoConfig.externalUrl) {
          topicStr.push(`- [Video: ${video.title}](${videoConfig.externalUrl})`);
        }
      });
    }
  });
  return convertMdToHtml(text + topicStr.join("\n"));
}