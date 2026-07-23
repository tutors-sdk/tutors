<script lang="ts">
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  import { tutorsConnectService, progressService } from "$lib/services/connect";
  import { page } from "$app/state";
  import { currentCourse, currentLo } from "$lib/runes.svelte";
  import { afterNavigate } from "$app/navigation";

  type Props = { children: Snippet };
  let { children }: Props = $props();

  tutorsConnectService.startTimer();

  let lastCourseId = "";
  $effect(() => {
    tutorsConnectService.learningEvent(page.params);

    if (currentCourse.value?.courseId !== lastCourseId) {
      tutorsConnectService.checkWhiteList();
      tutorsConnectService.courseVisit(currentCourse.value!);
      progressService.loadCourseProgress(currentCourse.value!);
      lastCourseId = currentCourse.value?.courseId!;
    }

    if (currentCourse.value && currentLo.value) {
      progressService.recordVisit(currentCourse.value.courseId, currentLo.value);
    }
  });

  afterNavigate(() => {
    const elemPage = document.querySelector("#content-panel");
    if (elemPage && window.innerWidth >= 600) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    document.getElementById("main-content")?.focus();
  });
</script>

<svelte:head>
  <title>{currentCourse?.value?.title}</title>
</svelte:head>

<CourseShell>
  <span id="content-panel" class="mt-[-60px] block pt-[60px]"></span>

  {@render children()}
</CourseShell>
