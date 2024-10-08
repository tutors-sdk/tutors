<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { CalendarChart } from "../analytics/calendar";

  export let timeActiveMap: Map<string, Map<string, number>>;
  export let userNamesAvatars: Map<string, [string, string]>;
  // export let userNamesUseridsMap: Map<string, string>;

  export let userIds: string[];

  let calendarChart: CalendarChart | null;

  onMount(() => {
    calendarChart = new CalendarChart(userNamesAvatars);
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
        calendarChart?.renderCombinedChart(calendarMap, userId);
      });
    }
  };

  $: chartHeight = userIds.length > 0 ? 30 + "%" : "90%";
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
    overflow-y: hidden;
    overflow-x: hidden;
  }
</style>
