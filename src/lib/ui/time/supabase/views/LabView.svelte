<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Lo } from "$lib/services/models/lo-types";
  import { LabHeatMapChart } from "../analytics/lab-heat-map";
    import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session
  export let userIds: string[];

  let labHeatMapChart: LabHeatMapChart | null;
  labHeatMapChart = new LabHeatMapChart(course, session, userIds);

  onMount(() => {
    labHeatMapChart?.populateSingleUserData();
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
    if (labHeatMapChart && course) {
      const container = labHeatMapChart.getChartContainer();
      labHeatMapChart.renderChart(container!);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id={"heatmap-container"} style="height: 100%; width:100%"></div>
</div>
