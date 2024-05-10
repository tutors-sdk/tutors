<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Lo } from "$lib/services/models/lo-types";
  import { LabSheet } from "./sheets/next-analytics/lab-sheet";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";

  export let user: StudentRecord;
  export let allLabs: Lo[] = [];

  let labSheet: LabSheet | null;
  labSheet = new LabSheet(allLabs, user);

  onMount(() => {
    labSheet?.populateSingleUserData(user);
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (labSheet) {
      labSheet = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (labSheet && user) {
      const container = labSheet.getChartContainer();
      labSheet.renderChart(container);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id={"heatmap-container"} style="height: 100%; width:100%"></div>
</div>
