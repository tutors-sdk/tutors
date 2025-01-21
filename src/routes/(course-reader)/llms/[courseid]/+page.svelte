<script lang="ts">
  import type { Lo } from "$lib/services/base";
  import { getVideoConfig } from "$lib/services/course/utils/lo-utils";
  import { convertMdToHtml } from "$lib/services/markdown";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  let videos: string[] = [];
  data.videos.forEach((video: Lo) => {
    const videoConfig = getVideoConfig(video);
    if (videoConfig.externalUrl) {
      videos.push(`- [${video.title}](${videoConfig.externalUrl})`);
    }
  });

  let topics: string[] = [];
  data.course.los.forEach((topic: Lo, index: number) => {
    const paddedIndex = index.toString().padStart(2, "0");
    topics.push(`- [${topic.title}](https://${data.course.courseUrl}/llms/topics/${paddedIndex}-llms-full.txt)`);
  });

  let text = `
# Docs for LLMs

We support the [llms.txt](https://llmstxt.org/) convention for making documentation available to large language models and the applications that make use of them.

## Content Summary

- [llms-full.txt](https://${data.course.courseUrl}/llms/llms-full.txt) — the complete course
- [llms-labs.txt](https://${data.course.courseUrl}/llms/llms-labs.txt) — just the labs
- [llms-notes.txt](https://${data.course.courseUrl}/llms/llms-notes.txt) — just the notes
- [llms-pdfs.txt](https://${data.course.courseUrl}/llms/llms-pdfs.txt) — a list of the PDFs
- [llms-pdf.zip](https://${data.course.courseUrl}/llms/llms-pdfs.zip) — archive of all PDFs

## Topics

`;
  text += topics.join("\n");
  text += "\n\n## Videos\n\n" + videos.join("\n");

  let textmd = convertMdToHtml(text);
</script>

<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html textmd}
    </div>
  </div>
</div>
