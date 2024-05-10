<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Lo } from "$lib/services/models/lo-types";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { LabCountSheet } from "./sheets/next-analytics/lab-count-sheet";

  export let user: StudentRecord;
  export let allLabs: Lo[] = [];
  let labCountSheet: LabCountSheet | null;

  onMount(async () => {
    labCountSheet = new LabCountSheet(user);
    labCountSheet.populateCols(allLabs);
    labCountSheet.renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labCountSheet) {
      labCountSheet = null;
    }
  });

  // Function to render the chart
  const renderChart = () => {
    if (labCountSheet) {
      labCountSheet.renderChart();
    }
  };

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id="chart-container" class="w-full h-full">
    {#if user}
      <div id={`chart-${user?.student.nickname}`} style="width: 100%; height: 100%"></div>
    {:else}
      <div id="chart" style="width: 100%; height: 100%"></div>
    {/if}
  </div>
</div>
