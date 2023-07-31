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
				<a class="card w-1/3 m-2 p-4" href={'/course/' + course.id}>
					<div>
						<p class="font-bold">{course.name}</p>
						<p>Last Accessed: {course.last_accessed}</p>
						<p>Visits: {course.visits}</p>
					</div>
				</a>
			{/each}
		{/if}
	</div>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Course Name</th>
					<th>Last Accessed</th>
					<th>No Of Visits</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#if data.courses}
					{#each data.courses[0].course_list.courses as course}
						<tr>
							<td><a href={'/course/' + course.id}>{course.name}</a></td>
							<td>{course.last_accessed}</td>
							<td>{course.visits}</td>
							<td
								><button class="btn btn-icon-sm btn-icon variant-filled-error"
									><Icon icon="mdi:delete" /></button
								></td
							>
						</tr>
					{/each}
				{:else}
					Oops, looks like you haven't visited any courses yet!
				{/if}
			</tbody>
		</table>
	</div>
</div>
