<script lang="ts">
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import { CalendarSheet, options } from "$lib/sheets/calendar-sheet";
  import Icon from "tutors-ui/lib/Atoms/Icon/Icon.svelte";
  import type { Calendar } from "tutors-reader-lib/src/types/lo-types";
  import type { UserMetric } from "tutors-reader-lib/src/types/metrics-types";

  export let calendarData: Calendar;
  export let userMap: Map<string, UserMetric>;

  let calendar: any;
  let calendarGrid: any;
  let calendarSheet = new CalendarSheet();

  onMount(async () => {
    calendarGrid = new Grid(calendar, { ...options });
    calendarSheet.populateCols(calendarData);
    for (const user of userMap.values()) {
      calendarSheet.populateRow(user, calendarData);
    }
    calendarSheet.render(calendarGrid);
  });

  let exportExcel = function () {
    calendarGrid.gridOptions.api.exportDataAsExcel();
  };
</script>

<div class="flex  justify-around p-1">
  <div class="w-1/2">
    <div class="text-base font-light text-gray-900">Time online this semester</div>
  </div>
  <div class="w-1/4">
    <button on:click="{exportExcel}">
      <Icon type="timeExport" />
    </button>
  </div>
</div>
<div class="h-screen">
  <div bind:this="{calendar}" style="height: 100%; width:100%" class="ag-theme-balham"></div>
</div>
