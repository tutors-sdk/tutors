<script lang="ts">
	import { currentCourse, currentUser } from '$lib/stores';
	import Icon from '../../Atoms/Icon/Icon.svelte';
	import { popup, Avatar } from '@skeletonlabs/skeleton';
	let gitUrl = '';
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
	<div class="relative">
		<button class="btn btn-sm space-x-1" use:popup={{ event: 'click', target: 'avatar' }}>
			<div class="relative inline-block">
				<Avatar width="w-10" src={$currentUser.picture} alt={$currentUser?.nickname} />
			</div>
		</button>
		<nav class="list-nav card card-body w-56 space-y-4 shadow-lg" data-popup="avatar">
			<span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
			<span class="ml-4 text-sm">{$currentUser.name}</span>
			<hr />
			<ul>
				<li>
					<a href={gitUrl} target="_blank" rel="noreferrer">
						<Icon type="github" />
						<div class="ml-2">Github Profile</div>
					</a>
				</li>
			</ul>
		</nav>
	</div>
{/if}
