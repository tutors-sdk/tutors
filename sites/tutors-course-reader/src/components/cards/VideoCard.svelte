<script lang="ts">
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentCourse } from "../../stores";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import { viewDelay } from "../animations";

  export let lo: Lo;
  let heanet = false;
  let vimp = false;
  let vimpId = "";
  let heanetId = "";
  let heanetPoster = "";
  const parts = lo.video.split("/");
  let defaultId = parts.pop() || parts.pop();

  let firefox = navigator.userAgent.indexOf("Firefox") != -1;

  if (lo && lo.type === "panelvideo") {
    lo.icon = { type: getIcon("video").icon, color: getIcon("video").colour };
  }

  if (lo.videoids) {
    if (lo.videoids.videoIds.length > 0) {
      if (lo.videoids.videoIds[lo.videoids.videoIds.length - 1].service === "heanet") {
        heanet = true;
        heanetId = lo.videoids.videoIds[lo.videoids.videoIds.length - 1].id;
        if (lo.type === "panelvideo") {
          heanetPoster = lo.parent.lo.img;
        } else {
          heanetPoster = lo.img;
        }
      } else if (lo.videoids.videoIds[lo.videoids.videoIds.length - 1].service === "vimp") {
        vimp = true;
        vimpId = lo.videoids.videoIds[lo.videoids.videoIds.length - 1].id;
      }
    }
  }

  let showVime = false;
  setTimeout(() => {
    showVime = true;
  }, viewDelay);
</script>

{#if $currentCourse && !$currentCourse.areVideosHidden()}
  <div class="container mx-auto text-center">
    {#if heanet}
      {#if showVime}
        <vime-player controls cross-origin="true">
          <vime-hls version="latest" cross-origin="true">
            <source data-src="https://media.heanet.ie/m3u8/{heanetId}" type="application/x-mpegURL" />
          </vime-hls>
        </vime-player>
      {/if}
    {:else if vimp}
    <div class="block w-[720px] h-[405px] mx-auto">
      <iframe
        title={lo.title}
        src="https://vimp.oth-regensburg.de/media/embed?key={vimpId}&autoplay=false&controls=true"
        class="iframeLoaded"
        allowfullscreen="allowfullscreen"
        width="720"
        height="405"
        allowtransparency="true"
        aria-label="media embed code"
      />
    </div>
    {:else}
      {#if firefox}
        <iframe
          title={lo.title}
          class="relative w-full p-2 aspect-video"
          src="https://www.youtube.com/embed/{defaultId}"
          allow="encrypted-media"
          allowfullscreen
          uk-responsive
        />
      {:else}
        <div class="relative aspect-video" style="padding-top: 40%;">
          <iframe
            title={lo.title}
            class="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/{defaultId}"
            allow="encrypted-media"
            allowfullscreen
            uk-responsive
          />
        </div>
      {/if}
    {/if}<br />
    <p class="text-lg italic justify-center">{lo.title}</p>
  </div>
{/if}
