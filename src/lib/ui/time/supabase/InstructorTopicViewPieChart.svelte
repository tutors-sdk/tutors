<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Topic } from "$lib/services/models/lo-types";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { TopicCountSheet } from "./sheets/tutors-analytics/topic-pie-chartartt

  export let course: Map<string, StudentRecord>;
  export const topics: Topic[] = [];

  let topicCountSheet: TopicCountSheet | null;

  onMount(() => {
    topicCountSheet = new TopicCountSheet();
    topicCountSheet.populateUsersData(course);
    renderChart();
  });

  const renderChart = () => {
    if (topicCountSheet) {
      topicCountSheet.renderChart();
    }
  };

  onDestroy(() => {
    if (topicCountSheet) {
      topicCountSheet = null;
    }
  });

  window.addEventListener("focus", renderChart);
</script>

<div class="h-screen">
  <div id={"chart"} style="height: 100%; width:100%"></div>
</div>
