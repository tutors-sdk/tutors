<script lang="ts">
    import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { onDestroy, onMount } from "svelte";
    import { CalendarSheet } from "./sheets/next-analytics/calendar-sheet";

  export let userMap: Map<string, StudentRecord>;

  let calendarSheet: CalendarSheet | null;

  onMount(() => {
    calendarSheet = new CalendarSheet();
    createAndRenderChart();
  });

  // Destroy the chart instance when the component unmounts
  onDestroy(() => {
    if (calendarSheet) {
      // Clean up resources if needed
      calendarSheet = null;
    }
  });

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    if (calendarSheet && userMap.size > 0) {
      createAndRenderChart();
    }
  };

  const createAndRenderChart = () => {
    if (userMap.size > 0) {
        Array.from(userMap.values()).forEach((user) => {
          calendarSheet?.createChartContainer(user.student.nickname);
          calendarSheet?.renderChart(user);
        });
      } else {
        calendarSheet?.createChartContainer(userMap.values().next().value);
        calendarSheet?.renderChart(userMap.values().next().value);
      }
  };

  // Calculate the height of each chart container dynamically
  $: chartHeight = userMap && userMap.size > 0 ? 100 / userMap.size + "%" : "50%";
  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen overflow-auto">
  {#if userMap.size > 0}
    {#each Array.from(userMap?.keys()) as userId}
      <div id={`chart-${userId}`} style={`height: 50%; width:100%;overflow-y: scroll;`}></div>
    {/each}
    <div id="heatmap-container" style="height: ${chartHeight}; width:100%;"></div>
  {:else}
    <div id="heatmap-container" style="height: 100%; width:100%;"></div>
  {/if}
</div>
