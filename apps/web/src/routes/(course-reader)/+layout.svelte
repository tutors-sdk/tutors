<script lang="ts">
	import { page } from '$app/stores';
	import { setInitialClassState } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { transitionKey, currentLo, onlineStatus } from '$lib/stores';
	import PageTransition from '$lib/ui/PageTransition.svelte';
	import { getKeys } from '$lib/environment';
	import { analyticsService } from '$lib/services/analytics';
	import { initServices } from '$lib/tutors-startup';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { get } from 'svelte/store';

	let mounted = false;
	let currentRoute = '';
	let presenceChannel: RealtimeChannel;

	export let data: any;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(async () => {
		mounted = true;
		setInitialClassState();
		initServices(data.session);
		const func = () => {
			if (!document.hidden && !currentRoute?.startsWith('/live' || '/dashboard')) {
				analyticsService.updatePageCount(data.course, session);
			}
		};
		setInterval(func, 30 * 1000);
		presenceChannel = supabase.channel('online-users', {
			config: {
				presence: {
					enabled: true,
					key: $page.params.courseid
				}
			}
		});

		presenceChannel.on('presence', { event: 'sync' }, () => {
			console.log('presence sync', presenceChannel.presenceState());
		});

		presenceChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
			console.log('users have joined:', newPresences);
		});

		presenceChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			console.log('users have left:', leftPresences);
		});

		const currentStatus = get(onlineStatus);

		if (currentStatus) {
			presenceChannel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					const status = await presenceChannel.track({
						online_at: new Date().toISOString(),
						user_name: session?.user?.user_metadata?.full_name,
						user_email: session?.user?.email,
						user_avatar: session?.user?.user_metadata?.avatar_url,
						course_id: $page.params.courseid,
						lo_id: $page.params.loid
					});
					console.log(status);
				}
			});
		} else {
			presenceChannel.unsubscribe();
		}
	});

	page.subscribe((path) => {
		if (path.route.id) {
			currentRoute = path.route.id;
		}
		if (mounted && path.params.courseid && getKeys().firebase.apiKey !== 'XXX') {
			analyticsService.learningEvent(path.params, session);
		}
		if (path?.url.hash && !path?.url.hash.startsWith('#access_token')) {
			console.log(path?.url.hash);
			const el = document.querySelector(`[id="${path.url.hash}"]`);
			if (el) {
				el.scrollIntoView({
					behavior: 'smooth'
				});
			}
		}
	});

	afterNavigate((params: any) => {
		if (!$page.url.hash) {
			const isNewPage: boolean =
				params.from && params.to && params.from.route.id !== params.to.route.id;
			const elemPage = document.querySelector('#page');
			if (isNewPage && elemPage !== null) {
				elemPage.scrollTop = 0;
			}
		}
	});
</script>

<svelte:head>
	{#if currentLo}
		<title>{$currentLo?.title}</title>
	{:else}
		<title>Tutors Course Reader</title>
	{/if}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
	<div id="top" />
	<div class="mx-auto my-4">
		<PageTransition url={$transitionKey}>
			<slot />
		</PageTransition>
	</div>
</div>
