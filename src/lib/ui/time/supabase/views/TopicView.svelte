<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type {  Course, Topic } from "$lib/services/models/lo-types";
    import { TopicHeatMapChart } from "../analytics/topic-heat-map";
    import type { Session } from "@supabase/supabase-js";

    export let course: Course;
    export let session: Session;
    export let userIds: string[] = [];

    let topicHeatMapChart: TopicHeatMapChart | null;
    topicHeatMapChart = new TopicHeatMapChart(course, session, userIds);
  
    onMount(() => {
      topicHeatMapChart?.populateSingleUserData();
      renderChart();
    });

    onDestroy(() => {
      if (topicHeatMapChart) {
        topicHeatMapChart = null;
      }
    });

    const renderChart = () => {
      if (topicHeatMapChart && course) {
        const container = topicHeatMapChart.getChartContainer();
        topicHeatMapChart.renderChart(container);
      }
    };

    window.addEventListener('focus', renderChart);
  </script>

  <div class="h-screen">
    <div id={"heatmap-container"} style="height: 100%; width:100%"></div>
</div>

  