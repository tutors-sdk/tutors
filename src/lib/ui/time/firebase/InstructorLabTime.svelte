<script lang="ts">
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-enterprise";
  import type { UserMetric } from "$lib/services/types/firebase-metrics";
  import type { Lo } from "$lib/services/models/lo-types";
  import { LabCountSheet } from "$lib/ui/time/firebase/sheets/lab-count-sheet";
  import { options } from "$lib/ui/time/firebase/sheets/lab-sheet";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  export let chart = false;
  export let userMap: Map<string, UserMetric>;
  export let allLabs: Lo[] = [];
  let time: any;
  let timeGrid: any;
  let timeSheet = new LabCountSheet();

  onMount(async () => {
    timeGrid = new Grid(time, { ...options });
    timeSheet.populateCols(allLabs);
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
    <div bind:this={time} class="ag-theme-balham h-full" />
  {/if}
</div>
