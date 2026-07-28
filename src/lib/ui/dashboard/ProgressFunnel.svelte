<script lang="ts">
  import type { StudentDashboardState } from "$lib/services/community/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { t } from "$lib/services/i18n";

  let { students } = $props<{ students: Map<string, StudentDashboardState> }>();

  const distribution = $derived.by(() => {
    const counts = new Map<string, { count: number; type: string; title: string }>();
    for (const [, state] of students) {
      const key = state.currentLoId || "unknown";
      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        counts.set(key, {
          count: 1,
          type: state.currentLoType,
          title: state.currentLoTitle || key
        });
      }
    }
    return [...counts.entries()]
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  });

  const maxCount = $derived(distribution.length > 0 ? distribution[0].count : 1);
</script>

<div class="flex flex-col gap-2">
  <h3 class="text-sm font-semibold">{t("dashboard.progress")}</h3>

  {#if distribution.length === 0}
    <p class="text-surface-500 py-4 text-center text-sm">No students connected</p>
  {:else}
    <div class="flex flex-col gap-1.5">
      {#each distribution as item}
        {@const widthPct = Math.max((item.count / maxCount) * 100, 8)}
        <div class="flex items-center gap-2">
          <div class="w-6 shrink-0 text-center">
            <Icon type={item.type} height="18" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="bg-surface-200-700-token h-6 w-full overflow-hidden rounded">
              <div
                class="preset-filled-primary-500 flex h-full items-center rounded px-2 text-xs font-medium text-white transition-all"
                style="width: {widthPct}%"
              >
                {item.count}
              </div>
            </div>
          </div>
          <span class="text-surface-600 w-36 shrink-0 truncate text-xs" title={item.title}>
            {item.title}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
