<script lang="ts">
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { TopicNavigatorCard, TalkCard } from 'tutors-ui';
	export let data: PageData;
</script>

{#if data.lo}
	<div class="flex w-11/12 mx-auto">
		<div class="w-full">
			{#key data.lo}
				{#if browser}
					<TalkCard lo={data.lo} />
				{/if}
			{/key}
		</div>
		<div class="hidden md:block">
			<TopicNavigatorCard topic={data.lo.parent} />
		</div>
	</div>
{/if}
