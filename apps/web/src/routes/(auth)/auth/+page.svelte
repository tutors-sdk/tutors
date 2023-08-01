<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	onMount(async () => {
		if (data.session) {
			window.location.href = '/dashboard';
		}
	});

	async function handleSignInWithGitHub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
	}
</script>

<div class="card m-auto mt-16 max-w-lg p-8">
	<div class="py-4">
		<button type="button" class="btn variant-filled w-full" on:click={handleSignInWithGitHub}>
			<span><Icon icon="mdi:github" /></span>
			<span>Sign in with GitHub</span>
		</button>
	</div>
	<span>By logging in you agree to the <a href="/terms">Terms & Conditions</a></span>
</div>
