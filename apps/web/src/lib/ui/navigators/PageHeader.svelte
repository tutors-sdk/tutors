<script lang="ts">
	import { currentCourse, portfolio } from '$lib/stores';
	import { Breadcrumbs, IconBar } from '$lib/ui/legacy';
</script>

{#if !$currentCourse?.isPortfolio() && !$portfolio}
	<div class="z-10 flex h-12 bg-primary-50 dark:bg-primary-900">
		<Breadcrumbs />
		{#if $currentCourse}
			<div class="flex flex-auto" />
			<div
				class="my-2 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none"
			>
				<IconBar nav={$currentCourse?.companions} />
			</div>
			<div
				class="my-2 ml-2 mr-10 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none"
			>
				<IconBar nav={$currentCourse?.wallBar} />
			</div>
		{/if}
	</div>
{/if}
