<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { CalendarChart } from "./sheets/tutors-analytics/calendar-chart";
  import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;

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
    if (calendarChart && course.loIndex.size > 0) {
      createAndRenderChart();
    }
  };

  const createAndRenderChart = () => {
    if (course.los.learningRecord.size > 0) {
      Array.from(course.values()).forEach((user) => {
        calendarChart?.createChartContainer(user.student.nickname);
        calendarChart?.renderChart(user);
      });
    } else {
      calendarChart?.createChartContainer(course.values().next().value);
      calendarChart?.renderChart(course.values().next().value);
    }
  };

  // Calculate the height of each chart container dynamically
  $: chartHeight = course && course.size > 0 ? 100 / course.size + "%" : "50%";
  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen overflow-auto">
  {#if course.size > 0}
    {#each Array.from(course?.keys()) as userId}
      <div id={`chart-${userId}`} style={`height: 50%; width:100%;overflow-y: scroll;`}></div>
    {/each}
    <div id="heatmap-container" style="height: ${chartHeight}; width:100%;"></div>
  {:else}
    <div id="heatmap-container" style="height: 100%; width:100%;"></div>
  {/if}
</div>
