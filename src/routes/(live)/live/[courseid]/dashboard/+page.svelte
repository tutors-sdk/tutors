<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { dashboardAggregatorService } from "$lib/services/community";
  import { startMockSimulation, stopMockSimulation } from "$lib/services/community/services/dashboard-mock";
  import ClassHealthGauge from "$lib/ui/dashboard/ClassHealthGauge.svelte";
  import AlertPanel from "$lib/ui/dashboard/AlertPanel.svelte";
  import ProgressFunnel from "$lib/ui/dashboard/ProgressFunnel.svelte";
  import StudentStateGrid from "$lib/ui/dashboard/StudentStateGrid.svelte";
  import CourseGroupHeader from "$lib/ui/time/CourseGroupHeader.svelte";
  import { Tabs } from "@skeletonlabs/skeleton-svelte";
  import { t } from "$lib/services/i18n";
  import type { Course } from "@tutors/tutors-model-lib";
  import type { EngagementState } from "$lib/services/community/types.svelte";

  interface Props {
    data: { courseid: string; course: Course };
  }
  let { data }: Props = $props();

  let studentFilter = $state<EngagementState | "all">("all");
  let isMock = false;

  onMount(() => {
    isMock = $page.url.searchParams.get("mock") === "true";
    if (isMock) {
      startMockSimulation(data.courseid);
    } else {
      dashboardAggregatorService.startListening(data.courseid);
    }
  });

  onDestroy(() => {
    if (isMock) {
      stopMockSimulation();
    } else {
      dashboardAggregatorService.stopListening();
    }
  });

  const health = $derived(dashboardAggregatorService.classHealth.value);
  const alerts = $derived(dashboardAggregatorService.alerts.value);
  const students = $derived(dashboardAggregatorService.studentStates.value);
</script>

<div class="relative flex w-full min-w-0 flex-col gap-4 p-4">
  {#if isMock}
    <span class="absolute top-2 right-4 z-50 rounded bg-warning-500 px-2 py-0.5 text-xs font-bold text-black">MOCK MODE</span>
  {/if}
  <section class="w-full">
    <CourseGroupHeader courseId={data.course.courseId!} courseTitle={data.course.title!} />
  </section>

  <section class="w-full">
    <ClassHealthGauge {health} />
  </section>

  <div class="grid w-full gap-4 lg:grid-cols-3">
    <div class="lg:col-span-2">
      <div class="bg-surface-100-800-token rounded-xl border border-surface-200 p-4 dark:border-surface-700">
        <AlertPanel {alerts} />
      </div>
    </div>
    <div>
      <div class="bg-surface-100-800-token rounded-xl border border-surface-200 p-4 dark:border-surface-700">
        <ProgressFunnel {students} />
      </div>
    </div>
  </div>

  <section class="bg-surface-100-800-token w-full rounded-xl border border-surface-200 p-4 dark:border-surface-700">
    <h3 class="mb-3 text-sm font-semibold">{t("dashboard.students") ?? "Students"}</h3>
    <Tabs defaultValue="all">
      <Tabs.List>
        <Tabs.Trigger value="all" onclick={() => (studentFilter = "all")}>
          All ({students.size})
        </Tabs.Trigger>
        <Tabs.Trigger value="active" onclick={() => (studentFilter = "active")}>
          {t("dashboard.active")} ({health.activeCount})
        </Tabs.Trigger>
        <Tabs.Trigger value="idle" onclick={() => (studentFilter = "idle")}>
          {t("dashboard.idle")} ({health.idleCount})
        </Tabs.Trigger>
        <Tabs.Trigger value="away" onclick={() => (studentFilter = "away")}>
          {t("dashboard.away")} ({health.awayCount})
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="all">
        <StudentStateGrid {students} filter="all" />
      </Tabs.Content>
      <Tabs.Content value="active">
        <StudentStateGrid {students} filter="active" />
      </Tabs.Content>
      <Tabs.Content value="idle">
        <StudentStateGrid {students} filter="idle" />
      </Tabs.Content>
      <Tabs.Content value="away">
        <StudentStateGrid {students} filter="away" />
      </Tabs.Content>
    </Tabs>
  </section>
</div>
