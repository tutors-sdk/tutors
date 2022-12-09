<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { getIcon } from "../../Atoms/Icon/themes";

  let firefox = false;

  onMount(async () => {
    if (navigator) {
      firefox = navigator?.userAgent.indexOf("Firefox") != -1;
    }
  });

  export let lo: Lo;
  let heanet = false;
  let vimp = false;
  let vimpId = "";
  let heanetId = "";
  const parts = lo.video.split("/");
  let defaultId = parts.pop() || parts.pop();

  if (lo && lo.type === "panelvideo") {
    lo.icon = { type: getIcon("video").icon, color: getIcon("video").colour };
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

  let showVime = false;
  setTimeout(() => {
    showVime = true;
  }, 500);
</script>

{#if $currentCourse && !$currentCourse.areVideosHidden()}
  <div class="mr-2 w-full p-8">
    {#if heanet}
      {#if showVime}
        <vime-player controls cross-origin="true">
          <vime-hls version="latest" cross-origin="true">
            <source data-src="https://media.heanet.ie/m3u8/{heanetId}" type="application/x-mpegURL" />
          </vime-hls>
        </vime-player>
      {/if}
    {:else if vimp}
      <div class="mx-auto block h-[405px] w-[720px]">
        <iframe
          title="{lo.title}"
          src="https://vimp.oth-regensburg.de/media/embed?key={vimpId}&autoplay=false&controls=true"
          class="iframeLoaded"
          width="720"
          height="405"
          aria-label="media embed code"
          allowtransparency="{true}"
          allowfullscreen></iframe>
      </div>
    {:else}
      {#if firefox}
        <iframe title="{lo.title}" class="relative mx-auto aspect-video w-5/6" src="https://www.youtube.com/embed/{defaultId}" allow="encrypted-media" allowfullscreen></iframe>
      {:else}
        <div class="relative mx-auto aspect-video w-5/6" style="padding-top: 40%;">
          <iframe title="{lo.title}" class="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/{defaultId}" allow="encrypted-media" allowfullscreen></iframe>
        </div>
      {/if}
    {/if}<br />
    <p class="text-center text-lg italic">{lo.title}</p>
  </div>
{/if}
