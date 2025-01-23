<script lang="ts">
  import { goto } from "$app/navigation";
  import { currentCourse } from "$lib/runes.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  if (data.course.llm === 0) {
    goto(`/course/${data.course.courseId}`);
  }
</script>

<div class="container mx-auto mt-2 items-center justify-between lg:flex">
  <div class="mx-4">
    <div class="prose dark:prose-invert">
      {@html data.page}
    </div>
  </div>
</div>
