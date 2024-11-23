<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import { currentCourse, layout } from "$lib/runes";
  import Image from "../../themes/Image.svelte";
  import { getIcon } from "../../themes/styles/icon-lib.svelte";
  import { cardTransition } from "$lib/ui/animations";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  type Props = {
    lo: Lo;
  };
  let { lo }: Props = $props();

  // svelte-ignore non_reactive_update
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
  }

  let headingText = $state("");
  let cardWidths = $state("");

  $effect(() => {
    if (layout.value === "compacted") {
      headingText = "!text-md font-medium";
      cardWidths = "w-36 h-[18rem]";
    } else {
      headingText = "!text-lg font-semibold";
      cardWidths = "w-60 h-[24rem]";
    }
  });
</script>

<a href={lo.route} {target}>
  <div
    transition:cardTransition
    class="card border-y-8 !bg-surface-50 dark:!bg-surface-700 border-{getIcon(lo.type)
      .color}-500 m-2 {cardWidths} transition-all hover:scale-105"
  >
    <header class="card-header flex flex-row items-center justify-between p-3">
      <div class="inline-flex w-full">
        <div class="line-clamp-2 flex-auto {headingText} !text-black dark:!text-white">
          {lo.title}
        </div>
        {#if !currentCourse?.value?.areVideosHidden}
          {#if lo.video && lo.type !== "video"}
            <!-- svelte-ignore node_invalid_placement_ssr -->
            <a href={lo.video}>
              <Icon type="video" />
            </a>
          {/if}
        {/if}
        <div class="flex-none"><Icon type={lo.type} /></div>
      </div>
    </header>
    <div class="card-body">
      <figure class="flex justify-center object-scale-down p-1">
        <Image {lo} />
      </figure>
    </div>
    <footer class="card-footer">
      <div class="prose mt-4 line-clamp-3 text-center leading-6 dark:prose-invert">
        {@html lo.summary}
      </div>
    </footer>
  </div>
</a>
