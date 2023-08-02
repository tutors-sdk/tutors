<script lang="ts">
	import { onMount } from 'svelte';
	import { currentCourse, currentUser } from '$lib/stores';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	onMount(() => {
		currentCourse.set(null);
		currentUser.set(null);
		handleSignOut();
	});
</script>

<div class="container mx-auto mt-8 text-center">
	<div>You have been logged out of Tutors. Thanks for visiting!</div>
</div>
