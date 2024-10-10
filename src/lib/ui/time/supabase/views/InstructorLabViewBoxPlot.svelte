<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { LabBoxPlotChart } from "../analytics/lab-box-plot";
  import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let userIds: string[];
  export let userNamesAvatars: Map<string, [string, string]>;
  let numOfCategories: number = 0;

  let labBoxPlot: LabBoxPlotChart | null = null;

  const renderCharts = () => {
    if (labBoxPlot !== null) {
      labBoxPlot.prepareBoxplotData().then(({ boxplotData, userNicknames }) => {
        labBoxPlot?.renderBoxPlot(document.getElementById("boxplot-container"), boxplotData, userNicknames);
        labBoxPlot?.prepareCombinedBoxplotData().then((combinedBoxplotData) => {
          labBoxPlot?.renderCombinedBoxplotChart(document.getElementById("combinedBoxPlot"), combinedBoxplotData);
        });
      });
    }
  };

  const handleFocus = () => {
    renderCharts();
  };

  onMount(() => {
    labBoxPlot = new LabBoxPlotChart(course, userIds, userNamesAvatars);
    renderCharts();
    window.addEventListener("focus", handleFocus);
  });

  onDestroy(() => {
    if (labBoxPlot) {
      labBoxPlot = null;
    }
    window.removeEventListener("focus", handleFocus);
  });

  numOfCategories = course.wallMap?.get("lab")?.length || 0;
  let innerDivWidth = numOfCategories * 30; // The width for the inner div
  let innerDivHeight = userIds.length * 45; // The height based on user count
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
