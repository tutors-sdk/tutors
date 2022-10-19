<script lang="ts">
  import { fade } from "svelte/transition";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentCourse, layout } from "../../stores";
  import { cardTransition } from "../animations";
  import { onDestroy } from "svelte";
  import Image from "./Image.svelte";
  import { convertMd } from "tutors-reader-lib/src/utils/markdown-utils";

  export let lo: Lo;
  let target = "";
  if (lo.type === "web") {
    if (lo.route.startsWith("http")) {
      target = "_blank";
    }
  }

  if (lo) {
    if (lo.type == "video") {
      lo.route = lo.video;
    }
    lo.summary = convertMd(lo.summary, "");
  }

  let headingText = "";
  let text = "";
  let cardWidths = "";
  let cardType = "tutorscard";
  let cardHeader = "tutorscard-header";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      headingText = "text-md font-medium";
      text = "text-xs";
      cardWidths = "w-36 h-[21rem]";
    } else {
      headingText = "text-lg font-semibold";
      text = "text-sm";
      cardWidths = "w-60 h-[24.5rem]";
    }
  });
  onDestroy(unsubscribe);
</script>

  <a href={lo.route} {target}>
    <div class="card bg-surface-900/50 border-y-8 m-2 {cardWidths} hover:scale-105 transition-all">
      <header class="card-header flex flex-row justify-between items-center p-3">
        <div class="inline-flex w-full">
          <div class="flex-auto {headingText}">{lo.title}</div>
          <div class="flex-none"><Icon type={lo.type} /></div>
        </div>
      </header>
      <div class="card-body">
        <figure class="flex justify-center object-scale-down p-1">
          <Image {lo} />
        </figure>
      </div>
      <footer class="card-footer">{#if $currentCourse && !$currentCourse.areVideosHidden()}
        {#if lo.video && lo.type !== "video"}
          <Icon link={lo.video} width={40} height={40} type="video" toolTip="Play video for this talk" />
        {/if}
      {/if}
      <div class="prose dark:prose-invert text-center line-clamp-3">
        {@html lo.summary}
      </div>
    </footer>
    </div>
  </a>