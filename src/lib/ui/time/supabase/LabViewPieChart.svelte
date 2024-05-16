<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabPieChart } from "./sheets/tutors-analytics/lab-pie-chart";
    import type { Session } from "inspector";

  export let course: Course;
  export let session:Session;

  let labPieChart: LabPieChart | null;

  onMount(async () => {
    labPieChart = new LabPieChart(course, session);
    labPieChart.populateCols(allLabs);
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
    {#if user}
      <div id={`chart-${user?.student.nickname}`} style="width: 100%; height: 100%"></div>
    {:else}
      <div id="chart" style="width: 100%; height: 100%"></div>
    {/if}
  </div>
</div>
