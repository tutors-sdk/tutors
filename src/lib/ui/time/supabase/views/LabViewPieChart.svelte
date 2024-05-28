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
  <div id="chart" style="height: 100%; width:100%"></div>
</div>
