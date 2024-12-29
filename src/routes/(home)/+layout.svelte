<script lang="ts">
  import { courseService } from "$lib/services/course.svelte";
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  type Props = { children: Snippet };
  let { children }: Props = $props();

  courseService.currentCourse.value = null;
</script>

<svelte:head>
  <title>Tutors</title>
</svelte:head>

<CourseShell>
  {@render children()}
</CourseShell>
