<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabSheet } from "./sheets/tutors-analytics/lab-heat-map-chartmap-chart";

  export let course: Course;
  let labSheet: LabSheet | null;
  labSheet = new LabSheet(course);

  onMount(() => {
    labSheet?.populateUsersData();
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labSheet) {
      // Clean up resources if needed
      labSheet = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (labSheet) {
      const container = labSheet.getChartContainer();
      labSheet.renderChart(container);

      const combinedLabData = labSheet.prepareCombinedLabData(course);
      const element = document.getElementById("combined-heatmap");
      if (!element) {
        throw new Error("Element with ID 'combined-heatmap' not found");
      }
      labSheet.renderCombinedLabChart(element, combinedLabData, "Total Time: Labs");
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen flex flex-col">
  <div id="heatmap-container" class="h-1/2 w-full overflow-y-scroll"></div>
  <div id="combined-heatmap" class="h-1/2 w-full overflow-y-scroll"></div>
</div>
