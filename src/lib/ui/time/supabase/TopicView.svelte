<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type {  Course, Topic } from "$lib/services/models/lo-types";
    import { TopicHeatMapChart } from "./sheets/tutors-analytics/topic-heat-map-chart";

    export let user: Course;
    export let topics: Topic[] = [];

    let topicHeatMapChart: TopicHeatMapChart | null;
    topicHeatMapChart = new TopicHeatMapChart(topics, user);
  
    onMount(() => {
      topicHeatMapChart?.populateSingleUserData(user);
      renderChart();
    });

    onDestroy(() => {
      if (topicHeatMapChart) {
        topicHeatMapChart = null;
      }
    });

    const renderChart = () => {
      if (topicHeatMapChart && user) {
        const container = topicHeatMapChart.getChartContainer();
        topicHeatMapChart.renderChart(container);
      }
    };

    window.addEventListener('focus', renderChart);
  </script>

  <div class="h-screen">
    <div id={"heatmap-container"} style="height: 100%; width:100%"></div>
</div>

  