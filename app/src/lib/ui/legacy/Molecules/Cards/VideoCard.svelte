<script lang="ts">
  import { onMount } from "svelte";
  import type { Lo } from "$lib/services/types/lo";
  import { currentCourse } from "$lib/stores";
  import { getIcon } from "../../Atoms/Icon/themes";

  let firefox = false;

  onMount(async () => {
    if (navigator) {
      firefox = navigator?.userAgent.indexOf("Firefox") != -1;
    }
  });

  export let lo: Lo;
  export let autoplay: boolean = false;
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
        <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
          <iframe
            title={lo.title}
            class="absolute inset-0 h-full w-full"
            src="https://media.heanet.ie/player/{heanetId}"
            allow="encrypted-media"
            allowfullscreen
          />
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
      />
    {:else}
      {#if firefox}
        {#if autoplay}
          <iframe
            title={lo.title}
            class="relative mx-auto aspect-video w-3/4"
            src="https://www.youtube.com/embed/{defaultId}?&autoplay=1"
            allow="encrypted-media"
            allowfullscreen
          />
        {:else}
          <iframe
            title={lo.title}
            class="relative mx-auto aspect-video w-3/4"
            src="https://www.youtube.com/embed/{defaultId}"
            allow="encrypted-media"
            allowfullscreen
          />
        {/if}
      {:else if autoplay}
        <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
          <iframe
            title={lo.title}
            class="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/{defaultId}?&autoplay=1"
            allow="encrypted-media"
            allowfullscreen
          />
        </div>
      {:else}
        <div class="relative mx-auto aspect-video w-3/4" style="padding-top: 40%;">
          <iframe
            title={lo.title}
            class="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/{defaultId}"
            allow="encrypted-media"
            allowfullscreen
          />
        </div>
      {/if}
    {/if}<br />
    <p class="text-center text-lg italic">{lo.title}</p>
  </div>
{/if}
