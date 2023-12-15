<script lang="ts">
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import type { UserMetric } from "$lib/services/types/metrics";
  import type { Lo } from "$lib/services/models/lo-types";
  import { LabCountSheet } from "../../services/sheets/lab-count-sheet";
  import { options } from "../../services/sheets/lab-sheet";

  export let chart = false;
  export let user: UserMetric;
  export let allLabs: Lo[] = [];
  let time: any;
  let timeGrid;
  let timeSheet = new LabCountSheet();

  onMount(async () => {
    timeGrid = new Grid(time, { ...options });
    if (allLabs.length > 0) {
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
