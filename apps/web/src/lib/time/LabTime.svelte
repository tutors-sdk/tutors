<script lang="ts">
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import 'ag-grid-enterprise';
	import type { UserMetric } from '$lib/types/metrics';
	import type { Lo } from '$lib/types/lo';
	import { LabCountSheet } from '../sheets/lab-count-sheet';
	import { options } from '../sheets/lab-sheet';

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
		if (chart) timeSheet.chart(timeGrid, 'groupedBar');
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
