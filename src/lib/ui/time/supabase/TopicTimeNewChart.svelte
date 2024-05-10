<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Topic } from "$lib/services/models/lo-types";
  import { TopicCountSheet } from "./sheets/next-analytics/topic-count-sheet";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";

  export let user: StudentRecord;
  export let topics: Topic[] = [];
  let topicPieSheet: TopicCountSheet | null;
  topicPieSheet = new TopicCountSheet();

  onMount(async () => {
    if (topics.length > 0) {
      topicPieSheet?.populateUserData(user);
      topicPieSheet?.renderChart();
    }
  });

  const renderChart = () => {
    if (topicPieSheet && user) {
      topicPieSheet.renderChart();
    }
  };

  onDestroy(() => {
      if (topicPieSheet) {
        topicPieSheet = null;
      }
    });

  window.addEventListener("focus", renderChart);
</script>

<div class="h-screen">
  <div id="chart" style="height: 100%; width:100%"></div>
</div>
