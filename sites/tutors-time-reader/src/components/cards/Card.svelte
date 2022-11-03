<script lang="ts">
  import { fade } from "svelte/transition";
  import Icon from "tutors-ui/lib/Atoms/Icon/Icon.svelte";
  import { getIcon } from "tutors-ui/lib/Atoms/Icon/themes";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentCourse, layout } from "../../stores";
  import { cardTransition } from "../animations";
  import { onDestroy } from "svelte";
  import { Image } from "tutors-ui";
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
      cardWidths = "w-36 h-64";
      cardType = "tutorscard-compact";
      cardHeader = "tutorscard-header-compact";
    } else {
      headingText = "text-md font-normal";
      text = "text-sm";
      cardWidths = "w-60";
      cardType = "tutorscard";
      cardHeader = "tutorscard-header";
    }
  });
  onDestroy(unsubscribe);
</script>

<div transition:cardTransition class="{cardType} {cardWidths} border-{getIcon(lo.type).colour}">
  <a href={lo.route} {target} in:fade={{ duration: 800 }}>
    <div class={cardHeader}>
      <h3 class="card-title {headingText}">{lo.title}</h3>
      <Icon type={lo.type} />
    </div>
    <figure class="flex justify-center">
      <Image {lo} />
    </figure>
    <div class="-p-2 card-body">
      <div class="tutorscard-body">
        {#if $currentCourse && !$currentCourse.areVideosHidden()}
          {#if lo.video && lo.type !== "video"}
            <Icon link={lo.video} width={40} height={40} type="video" toolTip="Play video for this talk" />
          {/if}
        {/if}
        <p />
        <div class="text-xs">
          {@html lo.summary}
        </div>
      </div>
    </div>
  </a>
</div>
