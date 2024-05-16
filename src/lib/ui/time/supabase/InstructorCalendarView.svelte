<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { CalendarChart } from "./sheets/tutors-analytics/calendar-chart";
  import type { Course } from "$lib/services/models/lo-types";
  import type { Session } from "@supabase/supabase-js";

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

  // Re-render the chart when the tab regains focus
  const handleFocus = () => {
    renderChart();
  };

  // Function to render the chart
  const renderChart = () => {
    // if (calendarChart && course.loIndex.size > 0) {
      createAndRenderChart();
    //}
  };

  const createAndRenderChart = () => {

     if (timeActiveMap.size > 1) {
      timeActiveMap.forEach((calendarMap, userId) => {
        calendarChart?.createChartContainer(userId);
        calendarChart?.renderCombinedChart(course, calendarMap, userId);
      });
    }
    
    // } else {
    //   calendarChart?.createChartContainer(course.values().next().value);
    //   calendarChart?.renderChart(course.values().next().value);
    // }
  };

  // Calculate the height of each chart container dynamically
  $: chartHeight = userIds && userIds.length > 0 ? 100 / userIds.length + "%" : "50%";
  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen overflow-auto">
  {#if userIds.length > 0}
    {#each userIds as userId}
      <div id={`chart-${userId}`} class="h-1/2 w-full overflow-y-scroll"></div>
    {/each}
    <div id="heatmap-container" class="h-${chartHeight} w-full"></div>
  {:else}
    <div id="heatmap-container" class="h-90 w-full"></div>
  {/if}
</div>

