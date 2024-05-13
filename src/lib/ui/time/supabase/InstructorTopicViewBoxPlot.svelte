<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Lo, Topic } from "$lib/services/models/lo-types";
    import type { StudentRecord } from "$lib/services/types/supabase-metrics";
    import { TopicBoxPlot } from "./sheets/tutors-analytics/topic-box-plot-chart-chart";

  export let course: Map<string, StudentRecord>;

  let topicBoxPlot: TopicBoxPlot | null;

  // Initialise the charts and render them when the component mounts
  onMount(() => {
    topicBoxPlot = new TopicBoxPlot();
    renderCharts();
  });

  // Destroy the chart instances when the component unmounts
  onDestroy(() => {
    if (topicBoxPlot) {
      topicBoxPlot = null;
    }
  });

  // Re-render the charts when the tab regains focus
  const handleFocus = () => {
    renderCharts();
  };

  // Function to render the charts
  const renderCharts = () => {
    if (topicBoxPlot) {
      const { boxplotData, userNicknames } = topicBoxPlot.prepareBoxplotData(course);
      topicBoxPlot.renderBoxPlot(document.getElementById("heatmap-container"), boxplotData, userNicknames);
      const combinedBoxplotData = topicBoxPlot.prepareCombinedBoxplotData(course);
      topicBoxPlot.renderCombinedBoxplotChart(document.getElementById('combinedBoxPlot'), combinedBoxplotData);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener('focus', handleFocus);
</script>

<div class="h-screen">
    <div id="heatmap-container" style="height: 50%; width:100%; overflow-y: scroll;"></div>
    <div id="combinedBoxPlot" style="height: 50%; width:100%; overflow-y: scroll;"></div>
</div>

