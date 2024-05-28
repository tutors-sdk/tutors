<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { TopicBoxPlotChart } from "../analytics/topic-box-plot";
    import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let userIds: string[];

  let topicBoxPlotChart: TopicBoxPlotChart | null;

  // Initialise the charts and render them when the component mounts
  onMount(() => {
    topicBoxPlotChart = new TopicBoxPlotChart(course, userIds);
    renderCharts();
  });

  // Destroy the chart instances when the component unmounts
  onDestroy(() => {
    if (topicBoxPlotChart) {
      topicBoxPlotChart = null;
    }
  });

  // Re-render the charts when the tab regains focus
  const handleFocus = () => {
    renderCharts();
  };

  // Function to render the charts
  const renderCharts = () => {
    if (topicBoxPlotChart) {
      const { boxplotData, userNicknames } = topicBoxPlotChart.prepareBoxplotData();
      topicBoxPlotChart.renderBoxPlot(document.getElementById("heatmap-container"), boxplotData, userNicknames);
      const combinedBoxplotData = topicBoxPlotChart.prepareCombinedBoxplotData();
      topicBoxPlotChart.renderCombinedBoxplotChart(document.getElementById("combinedBoxPlot"), combinedBoxplotData);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
  <div id="combinedBoxPlot" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>
