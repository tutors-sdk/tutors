<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { TopicBoxPlotChart } from "../analytics/topic-box-plot";
  import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let userIds: string[];
  //export let userNamesUseridsMap: Map<string, string>;
  export let userNamesAvatars: Map<string, [string, string]>;
  let numOfCategories: number = 0;

  let topicBoxPlotChart: TopicBoxPlotChart | null;

  // Initialise the charts and render them when the component mounts
  onMount(() => {
    topicBoxPlotChart = new TopicBoxPlotChart(course, userIds, userNamesAvatars);
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

  numOfCategories = Array.from(course.topicIndex.values()).filter((topic) => !topic.hide).length;

  let innerDivWidth = numOfCategories * 30; // The width for the inner div
  let innerDivHeight = userIds.length * 45; // The height based on user count

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<!-- Scrollable container -->
<div class="scrollable-container">
  <!-- Inner content that exceeds the height of the scrollable container -->
  <div class="inner-content" style="height: {innerDivHeight}px; width: {innerDivWidth}%;">
    <!-- boxplot containers -->
    <div id="boxplot-container" class="boxplot"></div>
    <div id="combinedBoxPlot" class="combined-boxplot"></div>
  </div>
</div>

<style>
  /* Outer scrollable container */
  .scrollable-container {
    height: 100vh; /* Adjust this value based on the height you want */
    min-width: 100vw; /* Full width */
    overflow: auto; /* Enable both vertical and horizontal scrolling */
    border: 1px solid #ccc;
    padding: 10px;
  }

  /* Inner content that may overflow the outer container */
  .inner-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: auto;
    height: auto;
    min-width: 100vw; /* Set a minimum width */
  }

  /* Individual heatmap styling */
  .boxplot {
    height: 50%; /* 75% of the inner-content height */
    width: 100%; /* Full width of the inner-content */
    min-height: 50vh; /* Set a minimum height */
  }

  .combined-boxplot {
    height: 50%; /* 25% of the inner-content height */
    width: 100%; /* Full width of the inner-content */
    min-height: 50vh; /* Set a minimum height */
  }
</style>
