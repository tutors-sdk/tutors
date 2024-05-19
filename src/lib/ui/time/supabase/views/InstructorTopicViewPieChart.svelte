<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Course, Topic } from "$lib/services/models/lo-types";
  import { TopicPieChart } from "../analytics/topic-pie";
    import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  const multipleUsers = true;

  let topicPieChart: TopicPieChart | null;

  onMount(() => {
    topicPieChart = new TopicPieChart(course, session, userIds, multipleUsers);
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
