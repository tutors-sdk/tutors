<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div class="bg-gradient-to-l from-primary-50 dark:from-primary-900 to-accent-50 dark:to-accent-900">
	<div class="container lg:flex mx-auto py-24 px-8">
		<p class="text-3xl font-bold">Welcome, {data.session.user.user_metadata.name}!</p>
	</div>
</div>

<div class="container mx-auto p-8">
	<p class="text-2xl font-bold py-4">Your previously accessed courses</p>
	<div class="flex flex-wrap">
		{#if data.courses}
			{#each data.courses[0].course_list.courses as course}
				<a class="card w-full lg:w-96 m-2 p-4" href={'/course/' + course.id}>
					<div>
						<p class="font-bold">{course.name}</p>
						<p>
							Last Accessed: {course.last_accessed.slice(0, 10)}
							{course.last_accessed.slice(11, 19)}
						</p>
						<p>Visits: {course.visits}</p>
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>
