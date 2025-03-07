<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";
  import { convertMdToHtml } from "$lib/services/markdown";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  if (data.course.llm === 0) {
    goto(`/course/${data.course.courseId}`);
  }

  const headding = `
## Docs for LLMs

Tutors supports the [llms.txt](https://llmstxt.org/) convention for making documentation available to large language models and the applications that make use of them.

### Complete Course Content
`;
  const headdingHtml = convertMdToHtml(headding);
</script>

<SecondaryNavigator lo={currentCourse.value} parentCourse={currentCourse.value?.properties?.parent} />
<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html headdingHtml}
      {@html data.llmsLinks}
    </div>
  </div>
</div>
