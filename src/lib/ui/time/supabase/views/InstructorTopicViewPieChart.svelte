<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Course, Topic } from "$lib/services/models/lo-types";
  import { TopicPieChart } from "../analytics/topic-pie";

  export let course: Course;
  export const topics: Topic[] = [];

  let topicPieChart: TopicPieChart | null;

  onMount(() => {
    topicPieChart = new TopicPieChart();
    topicPieChart.populateUsersData(course);
    renderChart();
  });

  const renderChart = () => {
    if (topicPieChart) {
      topicPieChart.renderChart();
    }
  };

  onDestroy(() => {
    if (topicPieChart) {
      topicPieChart = null;
    }
  });

  window.addEventListener("focus", renderChart);
</script>

<div class="h-screen">
  <div id={"chart"} style="height: 100%; width:100%"></div>
</div>
