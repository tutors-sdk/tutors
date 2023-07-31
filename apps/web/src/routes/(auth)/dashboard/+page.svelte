<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div class="container mx-auto p-8">
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
