<script lang="ts">
	import { onMount } from 'svelte';
	import { logout } from '$lib/utils/auth';
	import { currentUser } from '$lib/stores';
	onMount(() => {
		currentUser.set(null);
		logout();
	});
</script>

<div class="container mx-auto mt-8 text-center">
	<div>You have been logged out of Tutors</div>
</div>
