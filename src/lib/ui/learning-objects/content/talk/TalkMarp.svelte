<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { Progress } from "@skeletonlabs/skeleton-svelte";
  import type { Talk } from "@tutors/tutors-model-lib";
  import { renderMarpSlides, buildMarpMarkdown } from "$lib/services/markdown/services/marp-renderer";
  import { mermaidify } from "$lib/services/markdown/services/mermaid-action";
  import Icon from "$lib/ui/components/Icon.svelte";

  interface Props {
    lo: Talk;
  }
  let { lo }: Props = $props();

  let loading = $state(true);
  let error = $state("");
  let slideIndex = $state(0);
  let slideElements: string[] = $state([]);
  let marpCss = $state("");
  let viewport: HTMLElement | undefined = $state();

  const totalSlides = $derived(slideElements.length);
  const currentSlideHtml = $derived(slideElements[slideIndex] ?? "");

  onMount(() => {
    window.addEventListener("keydown", keypressInput);
    loadSlides();
  });

  onDestroy(() => {
    if (browser) window.removeEventListener("keydown", keypressInput);
  });

  function loadSlides() {
    try {
      const { html, css } = renderMarpSlides(buildMarpMarkdown(lo));
      marpCss = css;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const svgs = doc.querySelectorAll("svg[data-marpit-svg]");
      if (svgs.length > 0) {
        slideElements = Array.from(svgs).map((svg) => svg.outerHTML);
      } else {
        const sections = doc.querySelectorAll("section");
        slideElements = Array.from(sections).map((s) => s.outerHTML);
      }
      loading = false;
    } catch (e) {
      console.error("Error rendering Marp slides:", e);
      error = e instanceof Error ? e.message : "Failed to render slides";
      loading = false;
    }
  }

  function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
    }
  }

  function prevSlide() {
    if (slideIndex > 0) slideIndex--;
  }

  function nextSlide() {
    if (slideIndex < totalSlides - 1) slideIndex++;
  }

  function toggleFullscreen() {
    if (viewport && document.fullscreenElement !== viewport) {
      viewport.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
</script>

<svelte:head>
  {#if marpCss}
    {@html `<style>${marpCss}</style>`}
  {/if}
</svelte:head>

<div class="card mr-2 rounded-lg border p-2">
  <div class="mx-2 mb-2 flex items-center justify-between">
    <div class="text-sm">
      {#if totalSlides > 0}
        {slideIndex + 1} of {totalSlides}
      {/if}
    </div>
    <div>
      <button class="btn btn-sm" onclick={prevSlide}>
        <Icon type="left" tip="Previous slide" />
      </button>
      <button class="btn btn-sm" onclick={nextSlide}>
        <Icon type="right" tip="Next slide" />
      </button>
      <button class="btn btn-sm" onclick={toggleFullscreen}>
        <Icon type="fullScreen" tip="Toggle fullscreen" />
      </button>
    </div>
  </div>

  {#if loading}
    <div class="mt-72 mb-72 flex flex-col items-center justify-center">
      <Progress value={null} />
    </div>
  {:else if error}
    <div class="flex items-center justify-center p-8 text-sm text-red-500">
      {error}
    </div>
  {:else if totalSlides === 0}
    <div class="flex items-center justify-center p-8 text-sm opacity-60">
      No slides found in this presentation.
    </div>
  {:else}
    <div class="marp-viewport not-prose" bind:this={viewport} use:mermaidify={currentSlideHtml}>
      <div class="marp-slides">
        {#key slideIndex}
          {@html currentSlideHtml}
        {/key}
      </div>
    </div>
  {/if}
</div>

<style>
  .marp-viewport {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: white;
    border-radius: 0.25rem;
  }
  .marp-viewport:fullscreen {
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
  }
  :global(.marp-viewport .marp-slides) {
    width: 100%;
    height: 100%;
  }
  :global(.marp-viewport svg[data-marpit-svg]) {
    width: 100%;
    height: 100%;
    display: block;
  }
  :global(.marp-viewport section) {
    width: 100% !important;
    height: 100% !important;
    padding: 2rem;
    box-sizing: border-box;
  }
</style>
