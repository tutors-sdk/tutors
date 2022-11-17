<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import type { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
  import { LabCountSheet } from "../../components/sheets/lab-count-sheet";
  import { options } from "../../components/sheets/lab-sheet";

  export let id;
  export let chart = false;

  let time;
  let timeGrid;
  let timeSheet = new LabCountSheet();

  const cache: CourseService = getContext("cache");
  const metricsService: MetricsService = getContext("metrics");

  onMount(async () => {
    timeGrid = new Grid(time, { ...options });
    const user = await metricsService.fetchUserById(id);
    const allLabs = cache.course.walls.get("lab");
    if (allLabs) {
      timeSheet.populateCols(allLabs);
      timeSheet.populateRow(user, allLabs);
      timeSheet.render(timeGrid);
      if (chart) timeSheet.chart(timeGrid, "groupedBar");
    }
  });
</script>

<div class="h-screen">
  {#if chart}
    <div id="chart" class="ag-theme-balham h-5/6" />
    <div bind:this={time} class="ag-theme-balham" />
  {:else}
    <div bind:this={time} class="ag-theme-balham h-5/6" />
  {/if}
</div>
