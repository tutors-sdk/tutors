<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { CalendarChart } from "../analytics/calendar";
  import type { Session } from "@supabase/supabase-js";

  export let timeActiveMap: Map<string, Map<string, number>>;
  export let session: Session;
  export let medianTime: Map<string, number>;
  //export let userNamesUseridsMap: Map<string, string>;
  export let userAvatarsUseridsMap: Map<string, [string, string]>;

  let calendarChart: CalendarChart | null;
  // calendarChart = new CalendarChart(userAvatarsUseridsMap, userNamesUseridsMap);
  calendarChart = new CalendarChart(userAvatarsUseridsMap);

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
  // const handleFocus = () => {
  //   renderChart();
  // };

  // Function to render the chart
  const renderChart = () => {
    if (calendarChart) {
      calendarChart.createChartContainer(session.user.user_metadata.user_name);
      calendarChart.renderChart(timeActiveMap, session);
      calendarChart.renderMedianTimeCalendar(medianTime);
    }
  };

  // Listen for window focus event to trigger chart refresh
  // window.addEventListener("focus", handleFocus);
</script>

<div class="h-screen">
  {#if session}
    <div id={`chart-${session.user.user_metadata.user_name}`} style="height: 30%;"></div>
    <div id="median-chart" style="height: 70%;"></div>
  {:else}
    <div id="heatmap-container" style="height: 100%"></div>
  {/if}
</div>
