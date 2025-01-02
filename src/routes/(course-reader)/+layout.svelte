<script lang="ts">
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { page } from "$app/state";
  import { currentCourse } from "$lib/runes";

  type Props = { children: Snippet };
  let { children }: Props = $props();

  tutorsConnectService.startTimer();

  let lastCourseId = "";
  $effect(() => {
    tutorsConnectService.learningEvent(page.params);

    if (currentCourse.value?.courseId !== lastCourseId) {
      tutorsConnectService.courseVisit(currentCourse.value!, tutorsConnectService?.tutorsId.value);
      lastCourseId = currentCourse.value?.courseId!;
    }
  });
</script>

<svelte:head>
  <title>{currentCourse?.value?.title}</title>
</svelte:head>

<CourseShell>
  {@render children()}
</CourseShell>
