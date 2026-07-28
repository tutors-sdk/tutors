<script lang="ts">
  import type { ClassHealthMetrics } from "$lib/services/community/types.svelte";
  import { t } from "$lib/services/i18n";

  let { health } = $props<{ health: ClassHealthMetrics }>();

  const activeWidth = $derived(health.totalStudents > 0 ? (health.activeCount / health.totalStudents) * 100 : 100);
  const idleWidth = $derived(health.totalStudents > 0 ? (health.idleCount / health.totalStudents) * 100 : 0);
  const awayWidth = $derived(health.totalStudents > 0 ? ((health.awayCount + health.disconnectedCount) / health.totalStudents) * 100 : 0);

  const borderColor = $derived(
    health.healthLevel === "green" ? "border-success-500" : health.healthLevel === "amber" ? "border-warning-500" : "border-error-500"
  );
</script>

<div class="bg-surface-100-800-token rounded-xl border {borderColor} p-4">
  <h3 class="mb-2 text-sm font-semibold">{t("dashboard.classHealth")}</h3>

  <div class="flex h-6 w-full overflow-hidden rounded-full">
    {#if activeWidth > 0}
      <div class="bg-success-500 flex items-center justify-center text-xs font-bold text-white transition-all" style="width: {activeWidth}%">
        {#if activeWidth > 10}{health.activeCount}{/if}
      </div>
    {/if}
    {#if idleWidth > 0}
      <div class="bg-warning-500 flex items-center justify-center text-xs font-bold text-white transition-all" style="width: {idleWidth}%">
        {#if idleWidth > 10}{health.idleCount}{/if}
      </div>
    {/if}
    {#if awayWidth > 0}
      <div class="bg-error-500 flex items-center justify-center text-xs font-bold text-white transition-all" style="width: {awayWidth}%">
        {#if awayWidth > 10}{health.awayCount + health.disconnectedCount}{/if}
      </div>
    {/if}
  </div>

  <div class="mt-2 flex gap-4 text-xs">
    <span class="flex items-center gap-1">
      <span class="bg-success-500 inline-block h-2.5 w-2.5 rounded-full"></span>
      {t("dashboard.active")} ({health.activeCount})
    </span>
    <span class="flex items-center gap-1">
      <span class="bg-warning-500 inline-block h-2.5 w-2.5 rounded-full"></span>
      {t("dashboard.idle")} ({health.idleCount})
    </span>
    <span class="flex items-center gap-1">
      <span class="bg-error-500 inline-block h-2.5 w-2.5 rounded-full"></span>
      {t("dashboard.away")} ({health.awayCount + health.disconnectedCount})
    </span>
    <span class="text-surface-500 ml-auto">
      {health.totalStudents} total &middot; {health.activePercent}% active
    </span>
  </div>
</div>
