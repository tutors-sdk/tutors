<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { get } from 'svelte/store';

	import { setInitialClassState, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import {
		transitionKey,
		currentLo,
		onlineStatus,
		studentsOnlineList,
		studentsOnline
	} from '$lib/stores';
	import PageTransition from '$lib/ui/PageTransition.svelte';
	import { getKeys } from '$lib/environment';
	import { analyticsService } from '$lib/services/analytics';
	import { initServices } from '$lib/tutors-startup';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	let currentRoute = '';
	let presenceChannel: RealtimeChannel;

	export let data: any;
	let { supabase, session } = data;

	function updatePageCount() {
		if (
			!document.hidden &&
			!currentRoute.startsWith('/live') &&
			!currentRoute.startsWith('/dashboard')
		) {
			analyticsService.updatePageCount(data.course, session);
		}
	}

	presenceChannel = supabase.channel('online-users', {
		config: {
			presence: {
				enabled: true,
				key: $page.params.courseid
			}
		}
	});

	function setupPresenceChannel() {
		presenceChannel.on('presence', { event: 'sync' }, () => {
			const presenceState = presenceChannel.presenceState();
			const onlineUsersObj = Object.entries(presenceState)
				.filter(([key, _]) => key === $page.params.courseid)
				.map(([, value]) => value[0]);

			studentsOnline.set(onlineUsersObj.length);
			studentsOnlineList.set(onlineUsersObj);
		});

		presenceChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
			studentsOnline.update((count) => count + newPresences.length);
			studentsOnlineList.update((list) => [...list, ...newPresences]);
		});

		presenceChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			studentsOnline.update((count) => count - leftPresences.length);
			studentsOnlineList.update((list) =>
				list.filter((item) => !leftPresences.includes(item.studentEmail))
			);
		});

		try {
			presenceChannel.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					const trackingStatus = await presenceChannel.track({
						online_at: new Date().toISOString(),
						studentName: session?.user?.user_metadata?.full_name,
						studentEmail: session?.user?.email,
						studentImg: session?.user?.user_metadata?.avatar_url,
						course_id: $page.params.courseid,
						lo_id: $page.params.loid
					});
					console.log(trackingStatus);
				}
			});
		} catch (error) {
			console.log(error);
			onlineStatus.set(false);
			const t: ToastSettings = {
				message: 'Presence can only be re-enabled once per session. Please refresh and try again.',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	}

	let currentStatus: boolean;
	onlineStatus.subscribe((value) => {
		currentStatus = value;
	});

	$: {
		if (currentStatus) {
			setupPresenceChannel();
			console.log('subscribed');
		} else if (!currentStatus) {
			presenceChannel.unsubscribe();
			console.log('unsubscribed');
		}
	}

	onMount(() => {
		setInitialClassState();
		initServices(data.session);
		setInterval(updatePageCount, 30 * 1000);
	});

	page.subscribe((path) => {
		if (path.route.id) {
			currentRoute = path.route.id;
		}
		if (path.params.courseid && getKeys().firebase.apiKey !== 'XXX') {
			analyticsService.learningEvent(path.params, session);
		}
		if (path.url.hash && !path.url.hash.startsWith('#access_token')) {
			const el = document.querySelector(`[id="${path.url.hash}"]`);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});

	afterNavigate((params) => {
		if (!$page.url.hash) {
			const isNewPage = params.from && params.to && params.from.route.id !== params.to.route.id;
			const elemPage = document.querySelector('#page');
			if (isNewPage && elemPage !== null) {
				elemPage.scrollTop = 0;
			}
		}
	});
</script>

<svelte:head>
	{#if currentLo}
		<title>{$currentLo.title}</title>
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
