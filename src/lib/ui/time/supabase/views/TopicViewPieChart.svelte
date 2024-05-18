<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Course } from "$lib/services/models/lo-types";
  import { TopicPieChart } from "../analytics/topic-pie";
    import type { Session } from "@supabase/supabase-js";

  export let course: Course;
  export let session: Session;
  export let userIds: string[];
  let topicPieChart: TopicPieChart | null;
  topicPieChart = new TopicPieChart(course, session);

  onMount(async () => {
      topicPieChart?.renderChart();
    
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
  <div id="chart" style="height: 100%; width:100%"></div>
</div>
