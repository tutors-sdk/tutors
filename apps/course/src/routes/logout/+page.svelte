<script lang="ts">
	import { onMount } from 'svelte';
	import { clearLocalStorage, logout } from '$lib/utils/auth';
	import { currentCourse, currentUser } from '$lib/stores';
	onMount(() => {
		currentUser.set(null);
		currentCourse.set(null);
		clearLocalStorage();
		logout();
	});
</script>

<div class="container mx-auto mt-8 text-center">
	<div>You have been logged out of Tutors. Thanks for visiting!</div>
</div>
