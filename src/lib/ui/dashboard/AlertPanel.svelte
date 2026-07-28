<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { DashboardAlert } from "$lib/services/community/types.svelte";
  import { dashboardAggregatorService } from "$lib/services/community";
  import { t } from "$lib/services/i18n";

  let { alerts } = $props<{ alerts: DashboardAlert[] }>();

  const visibleAlerts = $derived(alerts.filter((a: DashboardAlert) => !a.dismissed));

  function dismiss(id: string) {
    dashboardAggregatorService.dismissAlert(id);
  }

  function formatTime(ts: number): string {
    const diff = Math.round((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }

  const severityConfig = {
    red: { border: "border-l-error-500", icon: "fluent:warning-24-filled", iconColor: "var(--color-error-500)" },
    amber: { border: "border-l-warning-500", icon: "fluent:info-24-filled", iconColor: "var(--color-warning-500)" },
    green: { border: "border-l-success-500", icon: "fluent:checkmark-circle-24-filled", iconColor: "var(--color-success-500)" }
  };
</script>

<div class="flex flex-col gap-2">
  <h3 class="text-sm font-semibold">{t("dashboard.alerts")}</h3>

  {#if visibleAlerts.length === 0}
    <p class="text-surface-500 py-4 text-center text-sm">{t("dashboard.noAlerts")}</p>
  {:else}
    <div class="flex max-h-96 flex-col gap-2 overflow-y-auto">
      {#each visibleAlerts as alert}
        {@const config = severityConfig[alert.severity as keyof typeof severityConfig]}
        <div class="bg-surface-100-800-token flex items-start gap-3 rounded-lg border-l-4 {config.border} p-3">
          <Iconify icon={config.icon} color={config.iconColor} height="20" class="mt-0.5 shrink-0" />

          {#if alert.studentAvatar}
            <img src={alert.studentAvatar} alt="" class="h-8 w-8 shrink-0 rounded-full" />
          {/if}

          <div class="min-w-0 flex-1">
            <p class="text-sm">{alert.message}</p>
            <p class="text-surface-500 text-xs">{formatTime(alert.timestamp)}</p>
          </div>

          <button
            onclick={() => dismiss(alert.id)}
            class="text-surface-400 hover:text-surface-600 shrink-0 p-1"
            aria-label="Dismiss alert"
          >
            <Iconify icon="carbon:close-outline" height="16" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
