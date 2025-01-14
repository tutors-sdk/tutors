<script lang="ts">
  import { convertMdToHtml } from "$lib/services/markdown";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();
  let text = `
# Docs for LLMs

We support the [llms.txt](https://llmstxt.org/) convention for making documentation available to large language models and the applications that make use of them.

Currently, we have the following files...

- [llms-full.txt](https://${data.course.courseUrl}/llms-full.txt) — the complete course
- [llms-labs.txt](https://${data.course.courseUrl}/llms-labs.txt) — just the labs
- [llms-notes.txt](https://${data.course.courseUrl}/llms-notes.txt) — just the notes
`;
  let textmd = convertMdToHtml(text);
</script>

<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html textmd}
    </div>
  </div>
</div>
