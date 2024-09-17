<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { TopicBoxPlotChart } from "../analytics/topic-box-plot";
    import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let userIds: string[];
  export let userNamesUseridsMap: Map<string, string>;

  let topicBoxPlotChart: TopicBoxPlotChart | null;

  // Initialise the charts and render them when the component mounts
  onMount(() => {
    topicBoxPlotChart = new TopicBoxPlotChart(course, userIds, userNamesUseridsMap);
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
  const renderCharts = async () => {
  if (topicBoxPlotChart) {
    const { boxplotData, userNicknames } = await topicBoxPlotChart.prepareBoxplotData();
    topicBoxPlotChart.renderBoxPlot(document.getElementById("boxplot-container"), boxplotData, userNicknames);
    const combinedBoxplotData = await topicBoxPlotChart.prepareCombinedBoxplotData();
    topicBoxPlotChart.renderCombinedBoxplotChart(document.getElementById("combinedBoxPlot"), combinedBoxplotData);
  }
};

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="flex flex-col h-screen">
  <div id="boxplot-container" class="flex-1 overflow-y-scroll"></div>
  <div id="combinedBoxPlot" class="flex-1 overflow-y-scroll"></div>
</div>
