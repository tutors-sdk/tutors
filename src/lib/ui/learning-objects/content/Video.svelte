<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "$lib/services/base";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import type { VideoConfig } from "$lib/services/base/lo-types";

  interface Props {
    lo: Lo;
    autoplay?: boolean;
  }
  let { lo = $bindable(), autoplay = false }: Props = $props();

  let firefox = $state(false);
  let showVime = $state(false);

  // Detect Firefox on mount
  onMount(() => {
    firefox = navigator?.userAgent.indexOf("Firefox") != -1;
    setTimeout(() => {
      showVime = true;
    }, 500);
  });

  // Extract video configuration
  function getVideoConfig(lo: Lo): VideoConfig {
    if (lo.videoids?.videoIds?.length > 0) {
      const lastVideo = lo.videoids.videoIds[lo.videoids.videoIds.length - 1];
      if (lastVideo.service === "heanet" || lastVideo.service === "vimp") {
        return { service: lastVideo.service, id: lastVideo.id };
      }
    }

    // Default to YouTube
    const parts = lo.video?.split("/") || [];
    const id = parts.pop() || parts.pop() || "";
    return { service: "youtube", id };
  }

  // Get video source URL based on configuration
  function getVideoSrc(config: VideoConfig): string {
    const urls = {
      heanet: `https://media.heanet.ie/player/${config.id}`,
      vimp: `https://vimp.oth-regensburg.de/media/embed?key=${config.id}&autoplay=false&controls=true`,
      youtube: `https://www.youtube.com/embed/${config.id}${autoplay ? "?&autoplay=1" : ""}`
    };
    return urls[config.service];
  }

  // Set icon for panel videos
  if (lo && lo.type === "panelvideo") {
    lo.icon = themeService.getIcon("video");
  }

  let videoConfig = $state(getVideoConfig(lo));
  let videoSrc = $derived(getVideoSrc(videoConfig));
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
          src={videoSrc}
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {:else if videoConfig.service === "vimp"}
      <iframe
        title={lo.title}
        src={videoSrc}
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
          src={videoSrc}
          allow="encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    {/if}
    <br />
    <p class="text-center text-lg italic">{lo.title}</p>
  </div>
{/if}
