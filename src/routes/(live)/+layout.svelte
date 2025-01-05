<script lang="ts">
  import { browser } from "$app/environment";
  import { currentCourse } from "$lib/runes";
  import { themeService } from "$lib/services/themes.svelte";
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
  <div
    class="bg-surface-100-800-token border-surface-200-700-token mx-2 mb-2 w-auto place-items-center overflow-hidden rounded-xl border-[1px] p-4 sm:mx-4"
  >
    {@render children()}
  </div>
</CourseShell>
