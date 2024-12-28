<script lang="ts">
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { page } from "$app/state";
  import { courseService } from "$lib/services/course.svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();

  tutorsConnectService.startTimer();

  let lastCourseId = "";
  $effect(() => {
    tutorsConnectService.learningEvent(page.params);

    if (courseService.currentCourse.value?.courseId !== lastCourseId) {
      tutorsConnectService.courseVisit(courseService.currentCourse?.value!, tutorsConnectService?.tutorsId.value);
      lastCourseId = courseService.currentCourse?.value?.courseId!;
    }
  });
</script>

<svelte:head>
  <title>{courseService.currentLo?.value?.title}</title>
</svelte:head>

<CourseShell>
  {@render children()}
</CourseShell>
