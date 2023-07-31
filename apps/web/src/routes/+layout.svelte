<script lang="ts">
	import 'tutors-ui/lib/themes/tutors.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import './app.postcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { storeTheme, currentCourse, studentsOnline } from '$lib/stores';

	import {
		AppBar,
		Avatar,
		storePopup,
		popup,
		drawerStore,
		type DrawerSettings,
		AppShell
	} from '@skeletonlabs/skeleton';
	import LayoutMenu from '$lib/ui/navigators/LayoutMenu.svelte';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';

	import tutors from '$lib/ui/legacy/themes/tutors.css?inline';
	import dyslexia from '$lib/ui/legacy/themes/dyslexia.css?inline';
	import halloween from '$lib/ui/legacy/themes/halloween.css?inline';
	import valentines from '$lib/ui/legacy/themes/valentines.css?inline';
	import Icon from '@iconify/svelte';
	import NavTitle from '$lib/ui/legacy/Molecules/NavTitle/NavTitle.svelte';
	import PageHeader from '$lib/ui/navigators/PageHeader.svelte';

	const themes: any = { tutors, dyslexia, halloween, valentines };
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data: any;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let status = false;

	const onlineDrawerOpen: any = () => {
		const settings: DrawerSettings = { id: 'online', position: 'right' };
		drawerStore.open(settings);
	};

	const calendarDrawerOpen: any = () => {
		const settings: DrawerSettings = { id: 'calendar', position: 'left' };
		drawerStore.open(settings);
	};

	const tocDrawerOpen: any = () => {
		const settings: DrawerSettings = { id: 'toc', position: 'right' };
		drawerStore.open(settings);
	};

	function setBodyThemeAttribute(): void {
		document.body.setAttribute('data-theme', $storeTheme);
	}

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event: any, _session: any) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		storeTheme.subscribe(setBodyThemeAttribute);
		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	{@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>
<AppShell class="h-screen">
	<svelte:fragment slot="header">
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
					<NavTitle />
				{/if}
			</svelte:fragment>

			{#if $currentCourse?.currentWeek}
				<div class="hidden w-full lg:flex">
					<button
						class="mx-auto inline-flex rounded-lg variant-soft-primary p-2"
						on:click={calendarDrawerOpen}
					>
						<span class="my-auto pl-2 pr-4">
							<Icon icon="fluent:calendar-ltr-12-regular" color="rgba(var(--color-primary-500))" />
						</span>
						<span class="divider-vertical h-12 hidden lg:flex my-auto" />
						<span class="px-2">
							<span class="pt-1 text-sm">Current Week</span><br />
							<span class="text-lg pb-1 font-bold">{$currentCourse.currentWeek.title}</span>
						</span>
					</button>
				</div>
			{/if}

			<svelte:fragment slot="trail">
				{#if data.session}
					<a class="btn btn-sm" href="/dashboard">
						<span class="hidden text-sm font-bold lg:block">Dashboard</span>
					</a>

					<span class="divider-vertical h-10 hidden lg:block" />
					<div class="relative">
						<button class="btn btn-sm space-x-1" use:popup={{ event: 'click', target: 'avatar' }}>
							<div class="relative inline-block">
								{#if status && studentsOnline}
									<span
										class="badge-icon variant-filled-error absolute -top-2 -right-2 z-10 text-white"
										>{$studentsOnline}</span
									>
								{/if}
								<span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
									{#if status}
										<Icon
											icon="fluent:presence-available-24-filled"
											color="rgba(var(--color-success-500))"
										/>
									{/if}
									{#if !status}
										<Icon
											icon="fluent:presence-available-24-regular"
											color="rgba(var(--color-error-500))"
										/>
									{/if}</span
								>
								<Avatar
									width="w-10"
									src={data.session.user.user_metadata.avatar_url}
									alt={data.session.user.user_metadata.name}
								/>
							</div>
						</button>
						<nav class="list-nav card card-body w-56 p-4 space-y-4 shadow-lg" data-popup="avatar">
							<span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
							<span class="ml-4 text-sm">{data.session.user.user_metadata.name}</span>
							<hr />
							<ul>
								<li class="flex">
									<!-- svelte-ignore a11y-missing-attribute -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<a on:click>
										{#if status}
											<Icon
												icon="fluent:presence-available-24-filled"
												color="rgba(var(--color-success-500))"
											/>
										{/if}
										{#if !status}
											<Icon
												icon="fluent:presence-available-24-regular"
												color="rgba(var(--color-error-500))"
											/>
										{/if}
										<div class="ml-2">Share Presence</div>
									</a>
								</li>
								{#if status}
									<li>
										<!-- svelte-ignore a11y-missing-attribute -->
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- <a on:click={onlineDrawerOpen}>
						<Icon type="listOnline" />
						<div class="ml-2">
							View <span class="badge bg-error-500 text-white">{$studentsOnline}</span> Online
						</div>
					</a> -->
									</li>
								{/if}
							</ul>
							<hr />
							<ul>
								<li>
									<a
										href={'https://github.com/' +
											data.session.user.user_metadata.preferred_username}
										target="_blank"
										rel="noreferrer"
									>
										<Icon icon="mdi:github" />
										<div class="ml-2">Github Profile</div>
									</a>
								</li>
								<li>
									<a href="/logout" rel="noreferrer">
										<Icon icon="fluent:sign-out-24-filled" color="rgba(var(--color-error-500))" />
										<div class="ml-2">Logout</div>
									</a>
								</li>
							</ul>
						</nav>
					</div>
				{:else}
					<a class="btn btn-sm" href="/auth">
						<span class="hidden text-sm font-bold lg:block">Login / Register</span>
					</a>
				{/if}
				<span class="divider-vertical h-10 hidden lg:block" />

				<LayoutMenu />

				{#if $page.url.pathname !== '/' && $page.url.pathname !== '/auth' && $page.url.pathname !== '/dashboard'}
					<span class="divider-vertical h-10 hidden lg:block" />
					<button class="btn btn-sm" on:click={tocDrawerOpen}>
						<Icon
							icon="fluent:line-horizontal-3-20-filled"
							color="rgba(var(--color-primary-500))"
						/>
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
		{#if $currentCourse && $page.url.pathname !== '/' && $page.url.pathname !== '/auth' && $page.url.pathname !== '/dashboard'}
			<PageHeader />
		{/if}
	</svelte:fragment>
	<slot />
</AppShell>
