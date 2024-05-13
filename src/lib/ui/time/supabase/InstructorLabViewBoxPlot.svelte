<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { LabBoxPlot } from "./sheets/tutors-analytics/lab-box-plot-chart-chart";

  export let course: Map<string, StudentRecord>;

  let labBoxPlot: LabBoxPlot | null;

  onMount(() => {
    labBoxPlot = new LabBoxPlot();
    renderCharts();
  });

  // Destroy the chart instances when the component unmounts
  onDestroy(() => {
    if (labBoxPlot) {
      // Clean up resources if needed
      labBoxPlot = null;
    }
  });

  // Re-render the charts when the tab regains focus
  const handleFocus = () => {
    renderCharts();
  };

  // Function to render the charts
  const renderCharts = () => {
    if (labBoxPlot) {
      const { boxplotData, userNicknames } = labBoxPlot.prepareBoxplotData(course);
      labBoxPlot.renderBoxPlot(document.getElementById("heatmap-container"), boxplotData, userNicknames);
      const combinedBoxplotData = labBoxPlot.prepareCombinedBoxplotData(course);
      labBoxPlot.renderCombinedBoxplotChart(document.getElementById("combinedBoxPlot"), combinedBoxplotData);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
  <div id="combinedBoxPlot" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>
