<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Topic } from "$lib/services/models/lo-types";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { TopicSheet } from "./sheets/next-analytics/topic-sheet";

  export let userMap: Map<string, StudentRecord>;
  export let topics: Topic[] = [];
  let topicSheet: TopicSheet | null;
  topicSheet = new TopicSheet(topics, userMap);

  onMount(() => {
    topicSheet?.populateUsersData();
    //combined
    renderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (topicSheet) {
      // Clean up resources if needed
      topicSheet = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (topicSheet) {
      const container = topicSheet.getChartContainer();
      topicSheet.renderChart(container);

      //combined
      const combinedTopicData = topicSheet.prepareCombinedTopicData(userMap);
      const element = document.getElementById("combined-heatmap");
      if (!element) {
        throw new Error("Element with ID 'combined-heatmap' not found");
      }
      topicSheet.renderCombinedTopicChart(element, combinedTopicData, "Total Time: Topics");
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen flex flex-col">
  <div id="heatmap-container" class="h-1/2 w-full overflow-y-scroll"></div>
  <div id="combined-heatmap" class="h-1/2 w-full overflow-y-scroll"></div>
</div>
