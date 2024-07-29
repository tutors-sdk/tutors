<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Topic } from "$lib/services/models/lo-types";
  import { TopicHeatMapChart } from "../analytics/topic-heat-map";
  import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  export let userNamesUseridsMap: Map<string, string>;
  let topicHeatMapChart: TopicHeatMapChart | null;

  onMount(() => {
    topicHeatMapChart = new TopicHeatMapChart(course, session, userIds, userNamesUseridsMap);
    topicHeatMapChart?.populateUsersData();
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (topicHeatMapChart) {
      // Clean up resources if needed
      topicHeatMapChart = null;
    }
  });

  // // Re-render the chart when the tab regains focus
  // const handleFocus = () => {
  //   renderChart();
  // };

  // Function to render the chart
  const renderChart = () => {
    if (topicHeatMapChart) {
      const container = topicHeatMapChart.getChartContainer();
      topicHeatMapChart.renderChart(container);

      //combined
      const combinedTopicData = topicHeatMapChart.prepareCombinedTopicData(userIds);
      const element = document.getElementById("combined-heatmap");
      if (!element) {
        throw new Error("Element with ID 'combined-heatmap' not found");
      }
      topicHeatMapChart.renderCombinedTopicChart(element, combinedTopicData, "Total Time: Topics");
    }
  };

  // Listen for window focus event to trigger chart refresh
  // window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen flex flex-col">
  <div id="heatmap-container" class="h-1/2 w-full overflow-y-scroll"></div>
  <div id="combined-heatmap" class="h-1/2 w-full overflow-y-scroll"></div>
</div>
