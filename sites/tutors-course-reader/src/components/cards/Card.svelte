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
      headingText = "text-xs font-medium";
      text = "text-xs";
      cardWidths = "w-32 h-56";
      cardType = "tutorscard-compact";
      cardHeader = "tutorscard-header-compact";
    } else {
      headingText = "text-md font-medium";
      text = "text-sm";
      cardWidths = "w-60";
      cardType = "tutorscard";
      cardHeader = "tutorscard-header";
    }
  });
  onDestroy(unsubscribe);
</script>

<div class="{cardType} {cardWidths} border-{getIcon(lo.type).colour}">
  <a href={lo.route} {target}>
    <div class="card m-1">
      <header class="card-header">
        <div class="inline-flex">
          <div class="flex-1">{lo.title}</div>
          <div class="flex-none"><Icon type={lo.type} /></div>
        </div>
      </header>
      <div class="card-body">
        <figure class="flex justify-center">
          <Image {lo} />
        </figure>
      </div>
      <footer class="card-footer">{#if $currentCourse && !$currentCourse.areVideosHidden()}
        {#if lo.video && lo.type !== "video"}
          <Icon link={lo.video} width={40} height={40} type="video" toolTip="Play video for this talk" />
        {/if}
      {/if}
      <div class="{text} prose">
        {@html lo.summary}
      </div>
    </footer>
    </div>
  </a>
</div>
