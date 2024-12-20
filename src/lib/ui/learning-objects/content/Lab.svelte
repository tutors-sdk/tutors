<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import type { LiveLab } from "$lib/services/models/live-lab";
  import { fly } from "svelte/transition";
  import { slideFromLeft } from "$lib/ui/themes/animations";
  import { currentCodeTheme } from "$lib/runes";

  interface Props {
    lab: LiveLab;
  }
  let { lab }: Props = $props();

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    browser ? window.removeEventListener("keydown", keypressInput) : null;
  });

  afterNavigate(() => {
    const elemPage = document.querySelector("#lab-panel");
    if (elemPage && window.innerWidth >= 800) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
      elemPage.querySelector("article")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  async function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      let step = lab.nextStep();
      goto(`${lab.url}/${step}`);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      let step = lab.prevStep();
      goto(`${lab.url}/${step}`);
    }
  }
  let isLoaded = $state(false);
  onMount(() => {
    isLoaded = true;
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="lab-content w-full">
  <div class="max-w-l flex">
    <div class="mr-2 hidden h-auto w-72 lg:block">
      {#if isLoaded}
        <div
          in:fly={slideFromLeft.in}
          out:fly={slideFromLeft.out}
          class="card sticky top-6 m-2 h-auto rounded-xl border-[1px] bg-surface-100 py-4 dark:border-primary-500
          dark:bg-surface-950"
        >
          <nav class="nav-list">
            <ul>
              {@html lab.navbarHtml}
            </ul>
          </nav>
        </div>
      {/if}
    </div>
    <div id="lab-panel" class="min-h-screen flex-1">
      <article class="prose max-w-none dark:prose-invert prose-pre:max-w-[70vw] sm:mx-2 md:mx-4">
        {#key currentCodeTheme.value}
          {@html lab.content}
        {/key}
      </article>
    </div>
  </div>

  <div class="fixed bottom-0 left-0 z-50 block w-full rounded border bg-primary-50 lg:hidden dark:bg-primary-900">
    <nav class="flex flex-wrap justify-between p-2">
      {@html lab.horizontalNavbarHtml}
    </nav>
  </div>
</div>

<style>
  :global(.lab-content) {
    padding-bottom: 3.5rem;
  }

  :global(.prose) {
    @media (max-width: 640px) {
      margin-left: 0.25rem !important;
      margin-right: 0.25rem !important;
    }
  }
</style>
