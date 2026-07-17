<script lang="ts">
  import { browser } from "$app/environment";
  import { currentCourse } from "$lib/runes.svelte";
  import TalkAdobe from "$lib/ui/learning-objects/content/TalkAdobe.svelte";
  import type { Talk } from "@tutors/tutors-model-lib";
  import { isMarpContent } from "$lib/services/markdown/services/marp-renderer";

  interface Props {
    lo: Talk;
    orientation?: "landscape" | "portrait";
  }
  let { lo, orientation = "landscape" }: Props = $props();

  const useMozilla = $derived(currentCourse.value?.defaultPdfReader === "mozilla");
  const isMarp = $derived(isMarpContent(lo));
</script>

{#if isMarp && browser}
  {#await import("$lib/ui/learning-objects/content/TalkMarp.svelte")}
    <div class="mt-72 mb-72 flex flex-col items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:then { default: TalkMarp }}
    <TalkMarp {lo} />
  {/await}
{:else if useMozilla && browser}
  {#await import("$lib/ui/learning-objects/content/TalkMozilla.svelte")}
    <div class="mt-72 mb-72 flex flex-col items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:then { default: TalkMozilla }}
    <TalkMozilla {lo} />
  {/await}
{:else if useMozilla && !browser}
  <div class="mt-72 mb-72 flex flex-col items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else}
  <TalkAdobe {lo} {orientation} />
{/if}
