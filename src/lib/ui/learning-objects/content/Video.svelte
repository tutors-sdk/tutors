<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "$lib/services/base";
  import { themeService } from "$lib/services/themes";
  import { currentCourse } from "$lib/runes.svelte";

  let firefox = $state(false);

  onMount(async () => {
    if (navigator) {
      firefox = navigator?.userAgent.indexOf("Firefox") != -1;
    }
  });

  interface Props {
    lo: Lo;
    autoplay?: boolean;
  }
  let { lo = $bindable(), autoplay = false }: Props = $props();

  let heanet = $state(false);
  let vimp = $state(false);
  let vimpId = $state("");
  let heanetId = $state("");
  const parts = lo?.video.split("/");
  let defaultId = $state(parts?.pop() || parts?.pop());

  $effect(() => {
    if (lo.video) {
      const parts = lo.video.split("/");
      defaultId = parts.pop() || parts.pop();
    }
  });

  if (lo && lo.type === "panelvideo") {
    lo.icon = { type: themeService.getIcon("video").type, color: themeService.getIcon("video").color };
  }

  if (lo.videoids) {
    if (lo.videoids.videoIds.length > 0) {
      if (lo.videoids.videoIds[lo.videoids.videoIds.length - 1].service === "heanet") {
        heanet = true;
        heanetId = lo.videoids.videoIds[lo.videoids.videoIds.length - 1].id;
      } else if (lo.videoids.videoIds[lo.videoids.videoIds.length - 1].service === "vimp") {
        vimp = true;
        vimpId = lo.videoids.videoIds[lo.videoids.videoIds.length - 1].id;
      }
    }
  }

  let showVime = $state(false);
  setTimeout(() => {
    showVime = true;
  }, 500);
</script>

{#if !currentCourse?.value?.areVideosHidden}
  <div class="w-full p-8">
    {#if heanet}
      {#if showVime}
        <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
          <iframe
            title={lo.title}
            class="absolute inset-0 h-full w-full"
            src="https://media.heanet.ie/player/{heanetId}"
            allow="encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      {/if}
    {:else if vimp}
      <iframe
        title={lo.title}
        src="https://vimp.oth-regensburg.de/media/embed?key={vimpId}&autoplay=false&controls=true"
        class="iframeLoaded"
        width="720"
        height="405"
        aria-label="media embed code"
        allowtransparency={true}
        allowfullscreen
      ></iframe>
    {:else if firefox}
      {#if autoplay}
        <iframe
          title={lo.title}
          class="relative mx-auto aspect-video w-3/4"
          src="https://www.youtube.com/embed/{defaultId}?&autoplay=1"
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      {:else}
        <iframe
          title={lo.title}
          class="relative mx-auto aspect-video w-3/4"
          src="https://www.youtube.com/embed/{defaultId}"
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      {/if}
    {:else if autoplay}
      <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
        <iframe
          title={lo.title}
          class="absolute inset-0 h-full w-full"
          src="https://www.youtube.com/embed/{defaultId}?&autoplay=1"
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {:else}
      <div class="relative mx-auto aspect-video" style="padding-top: 40%;">
        <iframe
          title={lo.title}
          class="absolute inset-0 h-full w-full"
          src="https://www.youtube.com/embed/{defaultId}"
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {/if}<br />
    <p class="text-center text-lg italic">{lo.title}</p>
  </div>
{/if}
