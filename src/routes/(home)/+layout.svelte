<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import CourseShell from "$lib/ui/TutorsShell.svelte";
  import type { Snippet } from "svelte";
  type Props = { children: Snippet };
  let { children }: Props = $props();

  currentCourse.value = null;
</script>

<svelte:head>
  <title>Tutors</title>
</svelte:head>

<CourseShell>
  {@render children()}
</CourseShell>
