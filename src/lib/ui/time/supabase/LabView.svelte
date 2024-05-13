<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabHeatMapChart } from "./sheets/tutors-analytics/lab-heat-map-chart";

  export let user: Course;
  export let allLabs: Lo[] = [];

  let labHeatMapChart: LabHeatMapChart | null;
  labHeatMapChart = new LabHeatMapChart(allLabs, user);

  onMount(() => {
    labHeatMapChart?.populateSingleUserData(user);
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labHeatMapChart) {
      labHeatMapChart = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (labHeatMapChart && user) {
      const container = labHeatMapChart.getChartContainer();
      labHeatMapChart.renderChart(container);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id={"heatmap-container"} style="height: 100%; width:100%"></div>
</div>
