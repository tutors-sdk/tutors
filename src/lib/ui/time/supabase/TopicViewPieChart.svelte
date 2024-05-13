<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course, Topic } from "$lib/services/models/lo-types";
  import { TopicPieChart } from "./sheets/tutors-analytics/topic-pie-chart";

  export let user: Course;
  export let topics: Topic[] = [];
  let topicPieChart: TopicPieChart | null;
  topicPieChart = new TopicPieChart();

  onMount(async () => {
    if (topics.length > 0) {
      topicPieChart?.populateUserData(user);
      topicPieChart?.renderChart();
    }
  });

  const renderChart = () => {
    if (topicPieChart && user) {
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
  <div id="chart" style="height: 100%; width:100%"></div>
</div>
