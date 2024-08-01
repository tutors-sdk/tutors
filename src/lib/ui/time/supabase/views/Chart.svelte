<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Course } from "$lib/services/models/lo-types";
  import { LabPieChart } from "../analytics/piechart/lab-pie-chart";
  import { TopicPieChart } from "../analytics/piechart/topic-pie-chart";
  import type { Session } from "@supabase/supabase-js";

  export let chartType: 'LabPieChart' | 'TopicPieChart';
  export let course: Course;
  export let session: Session;
  export let userIds: string[] = [];
  export let multipleUsers: boolean = false;

  let chartInstance: LabPieChart | TopicPieChart | null = null;

  onMount(() => {
    if (chartType === 'LabPieChart') {
      chartInstance = new LabPieChart(course, session);
    } else if (chartType === 'TopicPieChart') {
      chartInstance = new TopicPieChart(course, session, userIds, multipleUsers);
    }
    renderChart();
  });

  const renderChart = () => {
    if (chartInstance) {
      chartInstance.renderChart();
    }
  };

  onDestroy(() => {
    if (chartInstance) {
      chartInstance = null;
    }
  });

  window.addEventListener("focus", renderChart);
</script>

<div class="h-screen">
  <div id="chart" style="height: 100%; width: 100%;"></div>
</div>
