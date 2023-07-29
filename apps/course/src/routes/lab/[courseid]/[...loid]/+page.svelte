<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto, afterNavigate } from '$app/navigation';
	export let data: PageData;

	onMount(async () => {
		window.addEventListener('keydown', keypressInput);
	});

	onDestroy(() => {
		browser ? window.removeEventListener('keydown', keypressInput) : null;
	});

	afterNavigate(() => {
		if (!$page.url.hash) {
			const elemPage = document.querySelector('#page');
			if (elemPage) elemPage.scrollTop = 0;
		}
	});

	async function keypressInput(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			let step = data.lab.nextStep();
			goto(`${data.lab.url}/${step}`);
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			let step = data.lab.prevStep();
			goto(`${data.lab.url}/${step}`);
		}
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="block fixed w-full mx-auto bottom-0 lg:hidden bg-primary-50-900-token z-30">
	<nav class="flex flex-wrap justify-between p-2">
		{@html data.lab.horizontalNavbarHtml}
	</nav>
</div>

<div class="w-full">
	<div class="flex lg:w-10/12 2xl:w-3/4 mx-auto">
		<div class="hidden lg:block h-auto w-72 mr-2">
			<div class="sticky h-auto card bg-surface-100-800-token py-4 m-2 rounded-xl top-6 w-full">
				<nav class="nav-list">
					<ul>
						{@html data.lab.navbarHtml}
					</ul>
				</nav>
			</div>
		</div>
		<div id="lab-panel" class="flex-1 w-1/2 min-h-screen">
			<div class="card bg-surface-100-800-token p-8 lg:px-4 py-8 m-2 rounded-xl">
				<article class="mx-auto prose dark:prose-invert max-w-none w-[80%]">
					{@html data.lab.content}
				</article>
			</div>
		</div>
	</div>
</div>
