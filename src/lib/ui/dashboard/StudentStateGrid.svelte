<script lang="ts">
  import type { EngagementState, StudentDashboardState } from "$lib/services/community/types.svelte";
  import ActivitySparkline from "./ActivitySparkline.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  let {
    students,
    filter = "all"
  } = $props<{
    students: Map<string, StudentDashboardState>;
    filter?: EngagementState | "all";
  }>();

  const STALE_MS = 5 * 60 * 1000;

  const filteredStudents = $derived.by((): StudentDashboardState[] => {
    const now = Date.now();
    const all = [...students.values()] as StudentDashboardState[];
    const arr = all.filter((s) => now - s.lastEventTs < STALE_MS);
    if (filter === "all") return arr;
    return arr.filter((s) => s.engagement === filter);
  });

  function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    if (totalSec < 60) return `${totalSec}s`;
    const min = Math.floor(totalSec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    const rem = min % 60;
    return rem > 0 ? `${hr}h ${rem}m` : `${hr}h`;
  }

  const engagementColors: Record<EngagementState, string> = {
    active: "bg-success-500",
    idle: "bg-warning-500",
    away: "bg-error-500"
  };
</script>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#each filteredStudents as student (student.userId)}
    {@const dotColor = engagementColors[student.engagement] ?? "bg-surface-500"}
    <div class="bg-surface-100-800-token flex items-center gap-3 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
      <div class="relative shrink-0">
        <img src={student.avatar} alt={student.fullName} class="h-10 w-10 rounded-full" />
        <span class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-surface-800 {dotColor}"></span>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1">
          <span class="truncate text-sm font-medium">{student.fullName}</span>
          <Icon type={student.sentiment} height="14" />
        </div>
        <div class="flex items-center gap-1.5">
          <Icon type={student.currentLoType} height="14" />
          <span class="text-surface-500 truncate text-xs" title={student.currentLoTitle}>
            {student.currentLoTitle}
          </span>
        </div>
      </div>

      <div class="flex shrink-0 flex-col items-end gap-1">
        <span class="text-surface-500 text-xs font-mono">
          {formatDuration(student.timeOnCurrentLoMs)}
        </span>
        <ActivitySparkline events={student.navHistory} width={60} height={16} />
      </div>
    </div>
  {/each}

  {#if filteredStudents.length === 0}
    <p class="text-surface-500 col-span-full py-8 text-center text-sm">No students match this filter</p>
  {/if}
</div>
