<script lang="ts">
  import type { LoRecord } from "$lib/services/community";
  import Icon from "../components/Icon.svelte";

  let { course } = $props<{ course: LoRecord }>();
</script>

<div class="flex w-full justify-between pb-2">
  <h2 class="p-2 text-base font-semibold">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/course/{course?.courseId}"
      class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
    >
      <Icon type="course" height="20" /><span>{course?.courseTitle}: Course Home</span>
    </a>
  </h2>
  <h2 class="p-2 text-base font-semibold">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/live/{course?.courseId}"
      class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
    >
      <Icon type="live" height="20" /><span>Live Stream</span>
    </a>
  </h2>
</div>
