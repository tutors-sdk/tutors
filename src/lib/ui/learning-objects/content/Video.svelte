<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "$lib/services/base";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import { getVideoConfig } from "$lib/services/course/utils/lo-utils";

  interface Props {
    lo: Lo;
    autoplay?: boolean;
  }
  let { lo = $bindable() }: Props = $props();

  let showVime = $state(false);

  onMount(() => {
    setTimeout(() => {
      showVime = true;
    }, 500);
  });

  // Set icon for panel videos
  if (lo && lo.type === "panelvideo") {
    lo.icon = themeService.getIcon("video");
  }

  let videoConfig = $state(getVideoConfig(lo));

  $effect(() => {
    videoConfig = getVideoConfig(lo);
  });
</script>

{#if !currentCourse?.value?.areVideosHidden}
  <div class="w-full p-8">
    {#if videoConfig.service === "heanet" && showVime}
      <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
        <iframe
          title={lo.title}
          class="absolute inset-0 h-full w-full"
          src={videoConfig.url}
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {:else if videoConfig.service === "vimp"}
      <iframe
        title={lo.title}
        src={videoConfig.url}
        class="iframeLoaded"
        width="720"
        height="405"
        aria-label="media embed code"
        allowtransparency={true}
        allowfullscreen
      ></iframe>
    {:else}
      <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
        <iframe
          title={lo.title}
          class="absolute inset-0 h-full w-full"
          src={videoConfig.url}
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {/if}
    <br />
    <p class="text-center text-lg italic">{lo.title}</p>
  </div>
{/if}
