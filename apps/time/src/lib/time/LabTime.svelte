<script lang="ts">
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import type { UserMetric } from "tutors-reader-lib/src/types/metrics-types";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { LabCountSheet } from "$lib/sheets/lab-count-sheet";
  import { options } from "$lib/sheets/lab-sheet";

  export let chart = false;
  export let user: UserMetric;
  export let allLabs: Lo[] = [];
  let time: any;
  let timeGrid;
  let timeSheet = new LabCountSheet();

  onMount(async () => {
    timeGrid = new Grid(time, { ...options });
    timeSheet.populateCols(allLabs);
    timeSheet.populateRow(user, allLabs);
    timeSheet.render(timeGrid);
    if (chart) timeSheet.chart(timeGrid, "groupedBar");
  });
</script>

<div class="h-screen">
  {#if chart}
    <div id="chart" class="ag-theme-balham h-5/6"></div>
    <div bind:this="{time}" class="ag-theme-balham"></div>
  {:else}
    <div bind:this="{time}" class="ag-theme-balham h-5/6"></div>
  {/if}
</div>
