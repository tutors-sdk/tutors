<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { CalendarChart } from "../analytics/calendar";
  import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;
  export let timeActiveMap: Map<string, Map<string, number>>;
  export let userIds: string[];

  let calendarChart: CalendarChart | null;

  onMount(() => {
    calendarChart = new CalendarChart();
    createAndRenderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (calendarChart) {
      // Clean up resources if needed
      calendarChart = null;
    }
  });

  const createAndRenderChart = () => {
    if (timeActiveMap.size > 0) {
      timeActiveMap.forEach((calendarMap, userId) => {
        calendarChart?.createChartContainer(userId);
        calendarChart?.renderCombinedChart(course, calendarMap, userId);
      });
    }
  };

  $: chartHeight = userIds.length > 0 ? 60 + "%" : "90%";
</script>

<div class="h-screen overflow-auto">
  {#if userIds.length > 0}
    {#each userIds as userId}
      <div id={`chart-${userId}`} class="chart-container" style="--chart-height: {chartHeight};"></div>
    {/each}
  {:else}
    <div id="heatmap-container" class="h-90 w-full"></div>
  {/if}
</div>

<style>
  .chart-container {
    height: var(--chart-height);
    width: 100%;
    overflow-y: scroll;
  }
</style>
