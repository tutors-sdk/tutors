<script lang="ts">
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  import { tutorsConnectService } from "$lib/services/connect";
  import { page } from "$app/state";
  import { currentCourse, tutorsId, isLecturer, courseLecturers, contentLocks } from "$lib/runes.svelte";
  import { rbacService } from "$lib/services/rbac";
  import { afterNavigate } from "$app/navigation";
  import { goto } from "$app/navigation";

  type Props = { children: Snippet };
  let { children }: Props = $props();

  tutorsConnectService.startTimer();

  let lastCourseId = "";
  $effect(() => {
    tutorsConnectService.learningEvent(page.params);

    if (currentCourse.value?.courseId !== lastCourseId) {
      tutorsConnectService.checkWhiteList();
      tutorsConnectService.courseVisit(currentCourse.value!);
      lastCourseId = currentCourse.value?.courseId!;

      const login = tutorsId.value?.login?.toLowerCase();
      isLecturer.value = !!login && courseLecturers.value.includes(login);
      rbacService.loadLocks(currentCourse.value!.courseId);
    }
  });

  afterNavigate(({ to }) => {
    if (!isLecturer.value && to?.url?.pathname && currentCourse.value) {
      const lo = currentCourse.value.loIndex?.get(to.url.pathname);
      if (lo && contentLocks.value.get(lo.route)) {
        goto(`/course/${currentCourse.value.courseId}`);
        return;
      }
    }

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
