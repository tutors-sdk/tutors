<script lang="ts">
	import { page } from '$app/stores';
	import { AppShell, Toast, setInitialClassState } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import NavBar from '$lib/ui/navigators/NavBar.svelte';
	import PageHeader from '$lib/ui/navigators/PageHeader.svelte';
	import { Footer } from '$lib/ui/legacy';
	import { authenticating, transitionKey, currentCourse, currentLo } from '$lib/stores';
	import PageTransition from '$lib/ui/PageTransition.svelte';
	import { getKeys } from '$lib/environment';
	import TutorsTerms from '$lib/ui/support/TutorsTerms.svelte';
	import { analyticsService } from '$lib/services/analytics';
	import { initServices } from '$lib/tutors-startup';
	import Sidebars from '$lib/ui/navigators/sidebars/Sidebars.svelte';

	let mounted = false;
	let currentRoute = '';

	onMount(async () => {
		mounted = true;
		setInitialClassState();
		initServices();
		const func = () => {
			if (!document.hidden && !currentRoute?.startsWith('/live')) {
				analyticsService.updatePageCount();
			}
		};
		setInterval(func, 30 * 1000);
	});

	page.subscribe((path) => {
		if (path.route.id) {
			currentRoute = path.route.id;
		}
		if (mounted && path.params.courseid && getKeys().firebase.apiKey !== 'XXX') {
			analyticsService.learningEvent(path.params);
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
	{#if $authenticating}
		<TutorsTerms />
	{:else if $currentCourse}
		<Toast />
		<Sidebars />
		<AppShell class="h-screen">
			<svelte:fragment slot="header">
				<NavBar />
				<PageHeader />
			</svelte:fragment>
			<div id="top" />
			<div class="mx-auto my-4">
				<PageTransition url={$transitionKey}>
					<slot />
				</PageTransition>
			</div>
			<svelte:fragment slot="pageFooter">
				<div
					class="bg-surface-100-800-token border-t-[1px] border-surface-200-700-token bottom-0 mt-2"
				>
					<Footer />
				</div>
			</svelte:fragment>
		</AppShell>
	{/if}
</div>
