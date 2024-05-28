<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabHeatMapChart } from "../analytics/lab-heat-map";
    import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  let labHeatMapChart: LabHeatMapChart | null;
  labHeatMapChart = new LabHeatMapChart(course, session, userIds);

  onMount(() => {
    labHeatMapChart?.populateUsersData();
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labHeatMapChart) {
      // Clean up resources if needed
      labHeatMapChart = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (labHeatMapChart) {
      const container = labHeatMapChart.getChartContainer();
      if(container) labHeatMapChart.renderChart(container);

      const combinedLabData = labHeatMapChart.prepareCombinedLabData(userIds);
      const element = document.getElementById("combined-heatmap");
      if (!element) {
        throw new Error("Element with ID 'combined-heatmap' not found");
      }
      labHeatMapChart.renderCombinedLabChart(element, combinedLabData, "Total Time: Labs");
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen flex flex-col">
  <div id="heatmap-container" class="h-1/2 w-full overflow-y-scroll"></div>
  <div id="combined-heatmap" class="h-1/2 w-full overflow-y-scroll"></div>
</div>
