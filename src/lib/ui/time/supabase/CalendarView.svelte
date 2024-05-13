<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { StudentRecord } from "$lib/services/types/supabase-metrics";
  import { CalendarSheet } from "./sheets/tutors-analytics/calendar-chartrt";

  export let course: StudentRecord;

  let calendarSheet: CalendarSheet | null;
  calendarSheet = new CalendarSheet();

  onMount(() => {
    renderChart();
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
    if (calendarSheet) {
      calendarSheet.createChartContainer(course?.student.nickname);
      calendarSheet.renderChart(course);
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
