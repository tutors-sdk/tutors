<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { CalendarChart } from "./sheets/tutors-analytics/calendar-chart";
  import type { Course } from "$lib/services/models/lo-types";

  export let course: Course;

  let calendarChart: CalendarChart | null;
  calendarChart = new CalendarChart();

  onMount(() => {
    renderChart();
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
    if (calendarChart) {
      calendarChart.createChartContainer(course?.student.nickname);
      calendarChart.renderChart(course);
    }
  };

  // Listen for window focus event to trigger chart refresh
  window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  {#if course}
    <div id={`chart-${course?.student.nickname}`} style="height: 100%;"></div>
  {:else}
    <div id="heatmap-container" style="height: 100%"></div>
  {/if}
</div>
