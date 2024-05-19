<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { LabBoxPlotChart } from "../analytics/lab-box-plot";
    import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let userIds: string[];

  let labBoxPlot: LabBoxPlotChart | null;

  onMount(() => {
    labBoxPlot = new LabBoxPlotChart(course, userIds);
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
