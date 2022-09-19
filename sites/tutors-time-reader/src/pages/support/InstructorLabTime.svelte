<script lang="ts">
  import { LabCountSheet } from "../../components/sheets/lab-count-sheet";
  import { getContext, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import { options } from "../../components/sheets/lab-sheet";
  import { CourseService } from "../../reader-lib/services/course-service";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";

  let time;
  let timeGrid;
  let timeHeight = 1250;
  let timeSheet = new LabCountSheet();

  const cache: CourseService = getContext("cache");
  const metricsService = getContext("metrics");

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
  });

  let exportExcel = function() {
    timeGrid.gridOptions.api.exportDataAsExcel();
  };
</script>

<div class="flex justify-around justify-center p-1">
  <div class="w-1/2">
    <div class="text-base font-light text-gray-900"> Time spent on each lab</div>
  </div>
  <div class="w-1/4">
    <button on:click={exportExcel}>
      <Icon type="timeExport" toolTip="Export this sheet to excel" scale="1.5" />
    </button>
  </div>
</div>
<div style="height:{timeHeight}px">
  <div bind:this={time} style="height: 100%; width:100%" class="ag-theme-balham" />
</div>

