<script lang="ts">
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import { CalendarSheet, options } from "../sheets/calendar-sheet";
  import type { UserMetric } from "tutors-reader-lib/src/types/metrics-types";
  import type { Calendar } from "tutors-reader-lib/src/types/lo-types";

  export let user: UserMetric;
  export let calendarData: Calendar;

  let calendar: any;
  let calendarGrid: any;
  let calendarSheet = new CalendarSheet();

  onMount(async () => {
    calendarGrid = new Grid(calendar, { ...options });
    calendarSheet.populateCols(calendarData);
    calendarSheet.populateRow(user, calendarData);
    calendarSheet.render(calendarGrid);
  });

  let exportExcel = function () {
    calendarGrid.gridOptions.api.exportDataAsExcel();
  };
</script>

<div class="h-screen">
  <div bind:this="{calendar}" style="height: 100%; width:100%" class="ag-theme-balham"></div>
</div>
