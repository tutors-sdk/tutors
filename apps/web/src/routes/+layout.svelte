<script lang="ts">
	import 'tutors-ui/lib/themes/tutors.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import './app.postcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { AppBar, Avatar, LightSwitch } from '@skeletonlabs/skeleton';

	export let data: any;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event: any, _session: any) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<AppBar background="bg-surface-100-800-token" shadow="none" class="h-20 justify-center">
	<svelte:fragment slot="lead">
		{#if $page.url.pathname === '/' || $page.url.pathname === '/auth' || $page.url.pathname === '/dashboard'}
			<a href="/">
				<div class="flex space-x-4">
					<img src="/logo.svg" alt="tutors logo" />
					<span class="text-2xl font-bold">Tutors</span>
				</div>
			</a>
		{:else}
			<a href="/">
				<div class="flex space-x-4">
					<img src="/logo.svg" alt="tutors logo" />
					<span class="text-2xl font-bold">Tutors Course</span>
				</div>
			</a>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="trail">
		{#if data.session}
			<Avatar
				src={data.session.user.user_metadata.avatar_url}
				alt={data.session.user.user_metadata.name}
				width="w-12"
			/>
			<p>Welcome, {data.session.user.user_metadata.name}</p>
			<a class="btn btn-sm" href="/dashboard">
				<span class="hidden text-sm font-bold lg:block">Dashboard</span>
			</a>
			<a class="btn btn-sm" href="/logout">
				<span class="hidden text-sm font-bold lg:block">Log Out</span>
			</a>
		{:else}
			<a class="btn btn-sm" href="/auth">
				<span class="hidden text-sm font-bold lg:block">Login / Register</span>
			</a>
		{/if}
		<span class="divider-vertical h-10 hidden lg:block" />

		<LightSwitch />
	</svelte:fragment>
</AppBar>
<slot />
