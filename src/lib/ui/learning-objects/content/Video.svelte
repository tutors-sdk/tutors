<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "$lib/services/base";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import type { VideoIdentifier } from "$lib/services/base/lo-types";

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
  function getVideoConfig(lo: Lo): VideoIdentifier {
    let config: VideoIdentifier = { service: "youtube", id: "" };
    if (lo.videoids?.videoIds?.length > 0) {
      const lastVideo = lo.videoids.videoIds[lo.videoids.videoIds.length - 1];
      if (lastVideo.service === "heanet" || lastVideo.service === "vimp") {
        config.service = lastVideo.service;
        config.id = lastVideo.id;
      } else {
        const parts = lo.video?.split("/") || [];
        const id = parts.pop() || parts.pop() || "";
        config.id = id;
      }
    }
    if (config.service === "heanet") {
      config.url = `https://media.heanet.ie/player/${config.id}`;
    } else if (config.service === "vimp") {
      config.url = `https://vimp.oth-regensburg.de/media/embed?key=${config.id}&autoplay=false&controls=true`;
    } else if (config.service === "youtube") {
      config.url = `https://www.youtube.com/embed/${config.id}${autoplay ? "?&autoplay=1" : ""}`;
    }
    return config;
  }

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
