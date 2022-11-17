<script lang="ts">
  import { LabCountSheet } from "../../components/sheets/lab-count-sheet";
  import { getContext, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import { options } from "../../components/sheets/lab-sheet";
  import Icon from "tutors-ui/lib/Atoms/Icon/Icon.svelte";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import type { MetricsService } from "tutors-reader-lib/src/services/metrics-service";

  export let chart = false;
  let time;
  let timeGrid;
  let timeSheet = new LabCountSheet();

  const cache: CourseService = getContext("cache");
  const metricsService: MetricsService = getContext("metrics");

  onMount(async () => {
    timeGrid = new Grid(time, { ...options });
    const allLabs = cache.course.walls.get("lab");
    timeSheet.populateCols(allLabs);
    let userMap = await metricsService.fetchAllUsers();
    if (cache.course.hasEnrollment()) {
      userMap = metricsService.filterUsers(userMap, cache.course.getStudents());
    }
    for (const user of userMap.values()) {
      timeSheet.populateRow(user, allLabs);
    }
    timeSheet.render(timeGrid);
    if (chart) timeSheet.chart(timeGrid, "stackedArea");
  });

  let exportExcel = function () {
    timeGrid.gridOptions.api.exportDataAsExcel();
  };
</script>

<div class="flex justify-around p-1">
  <div class="w-1/2">
    <div class="text-base font-light text-gray-900">Time spent on each lab</div>
  </div>
  <div class="w-1/4">
    <button on:click={exportExcel}>
      <Icon type="timeExport" />
    </button>
  </div>
</div>
<div class="h-screen">
  {#if chart}
    <div id="chart" class="ag-theme-balham h-5/6" />
    <div bind:this={time} class="ag-theme-balham" />
  {:else}
    <div bind:this={time} class="ag-theme-balham h-5/6" />
  {/if}
</div>
