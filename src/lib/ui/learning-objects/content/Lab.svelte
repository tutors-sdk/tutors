<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import Iconify from "@iconify/svelte";
  import type { LiveLab } from "$lib/services/course";
  import { currentCodeTheme } from "$lib/services/markdown";

  interface Props {
    lab: LiveLab;
  }
  let { lab }: Props = $props();

  let loaded = false;
  let lastLab = lab.lab.id;

  // Reactive step indicator (uses LiveLab's public state)
  const steps = $derived(lab.steps?.length ?? 0);
  const currentStep = $derived(steps > 0 ? lab.index + 1 : 0);
  const progressPct = $derived(steps > 0 ? Math.min(100, Math.round((currentStep / steps) * 100)) : 0);
  const hasPrev = $derived(steps > 0 && lab.index > 0);
  const hasNext = $derived(steps > 0 && lab.index < steps - 1);

  function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (target.isContentEditable) return true;
    return false;
  }

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    if (browser) window.removeEventListener("keydown", keypressInput);
  });

  afterNavigate(() => {
    if (!loaded || lastLab !== lab.lab.id) {
      lastLab = lab.lab.id;
      loaded = true;
      return;
    }
    const elemPage = document.querySelector("#lab-panel");
    if (elemPage && window.innerWidth >= 600) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  async function keypressInput(e: KeyboardEvent) {
    // Don't hijack keys while the learner is typing in a field
    if (isEditableTarget(e.target)) return;
    // Respect modifier keys (browser shortcuts, find-in-page, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
  }

  function goPrev() {
    const step = lab.prevStep();
    if (step) goto(`${lab.url}/${step}`);
  }
  function goNext() {
    const step = lab.nextStep();
    if (step) goto(`${lab.url}/${step}`);
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

<div class="lab-content w-full pb-28 lg:pb-14">
  <div class="max-w-l flex">
    <div class="mr-2 hidden h-auto w-72 lg:block">
      <div
        class="card bg-surface-100 border-primary-100 dark:border-primary-500 dark:bg-surface-950 sticky top-14 m-2 h-auto rounded-xl border-[1px] py-4"
      >
        <nav class="nav-list" aria-label="Lab steps">
          <ul>
            {@html lab.navbarHtml}
          </ul>
        </nav>
      </div>
    </div>
    <div class="min-h-screen flex-1">
      {#if steps > 1}
        <div class="bg-surface-100/80 dark:bg-surface-900/80 sticky top-12 z-[5] mx-1 mt-1 mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-xs backdrop-blur md:mx-4">
          <span class="font-semibold whitespace-nowrap">Step {currentStep} of {steps}</span>
          <div class="bg-surface-300 dark:bg-surface-700 relative h-1.5 flex-1 overflow-hidden rounded-full">
            <div class="bg-primary-500 absolute inset-y-0 left-0 transition-all" style="width: {progressPct}%"></div>
          </div>
          <div class="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onclick={goPrev}
              disabled={!hasPrev}
              aria-label="Previous step"
              class="hover:bg-surface-200 dark:hover:bg-surface-800 inline-flex h-7 w-7 items-center justify-center rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Iconify icon="ph:arrow-left" width="16" height="16" />
            </button>
            <button
              type="button"
              onclick={goNext}
              disabled={!hasNext}
              aria-label="Next step"
              class="hover:bg-surface-200 dark:hover:bg-surface-800 inline-flex h-7 w-7 items-center justify-center rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Iconify icon="ph:arrow-right" width="16" height="16" />
            </button>
          </div>
        </div>
      {/if}

      <article class="prose dark:prose-invert prose-pre:overflow-x-auto 2xl:prose-pre:max-w-[120ch] max-w-[65ch] sm:mx-1 md:mx-4 2xl:max-w-[120ch]">
        {#key currentCodeTheme.value}
          <span id="lab-panel" class="mt-[-60px] block pt-[60px]">
            {@html lab.content}
          </span>
        {/key}
      </article>

      {#if steps > 1}
        <div class="mx-1 mt-8 mb-4 hidden items-center justify-between md:mx-4 md:flex">
          <button
            type="button"
            onclick={goPrev}
            disabled={!hasPrev}
            class="btn preset-tonal inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Iconify icon="ph:arrow-left" width="16" height="16" />
            Previous
          </button>
          <span class="text-xs opacity-60">Tip: use ← / → arrow keys</span>
          <button
            type="button"
            onclick={goNext}
            disabled={!hasNext}
            class="btn preset-filled-primary-500 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <Iconify icon="ph:arrow-right" width="16" height="16" />
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class="bg-primary-50 dark:bg-primary-900 fixed bottom-0 left-0 z-50 block w-full rounded-sm border lg:hidden">
    <nav class="flex flex-wrap justify-between p-2" aria-label="Lab steps (mobile)">
      {@html lab.horizontalNavbarHtml}
    </nav>
  </div>
</div>
