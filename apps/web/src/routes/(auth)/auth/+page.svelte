<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let email: any;
	let password: any;

	const handleSignUp = async () => {
		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`
			}
		});
	};

	const handleSignIn = async () => {
		await supabase.auth.signInWithPassword({
			email,
			password
		});
	};

	async function handleSignInWithGitHub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'github'
		});
	}

	const handleSignOut = async () => {
		await supabase.auth.signOut();
	};

	let tabSet: number = 0;
</script>

<div class="card m-auto mt-16 max-w-md p-8">
	<div class="py-4">
		<button type="button" class="btn variant-filled w-full" on:click={handleSignInWithGitHub}>
			<span><Icon icon="mdi:github" /></span>
			<span>Sign in with GitHub</span>
		</button>
	</div>
</div>
