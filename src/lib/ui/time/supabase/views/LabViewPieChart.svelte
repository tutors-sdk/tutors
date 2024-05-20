<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabPieChart } from "../analytics/lab-pie";
  import type { Session } from "@supabase/supabase-js";
  export let course: Course;
  export let session:Session;

  let labPieChart: LabPieChart | null;

  onMount(async () => {
    labPieChart = new LabPieChart(course, session);
    labPieChart.populateCols();
    labPieChart.renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labPieChart) {
      labPieChart = null;
    }
  });

  // Function to render the chart
  const renderChart = () => {
    if (labPieChart) {
      labPieChart.renderChart();
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
    {#if session}
      <div id={`chart-${session.user.user_metadata.username}`} style="width: 100%; height: 100%"></div>
    {:else}
      <div id="chart" style="width: 100%; height: 100%"></div>
    {/if}
  </div>
</div>
