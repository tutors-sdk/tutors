<script lang="ts">
  import { progressService } from "$lib/services/connect";
  import { currentCourse } from "$lib/runes.svelte";
  import ProgressRing from "./ProgressRing.svelte";

  const progress = $derived.by(() => {
    if (!currentCourse.value) return null;
    return progressService.getProgress(currentCourse.value);
  });
</script>

{#if progress && progress.percentage > 0}
  <div class="bg-surface-100 dark:bg-surface-900 mx-auto mb-2 flex w-11/12 items-center gap-3 rounded-xl px-4 py-2">
    <ProgressRing percentage={progress.percentage} size={32} strokeWidth={3} />
    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-baseline justify-between">
        <span class="text-sm font-medium text-blue-500">{progress.percentage}% complete</span>
        <span class="text-xs opacity-60">{progress.visited} of {progress.total} activities</span>
      </div>
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-blue-500/20">
        <div class="h-full rounded-full bg-blue-500 transition-all duration-300" style="width: {progress.percentage}%"></div>
      </div>
    </div>
  </div>
{/if}
