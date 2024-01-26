<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import Iconify from "@iconify/svelte";
  import { layout } from "$lib/stores";
  import { cardTransition } from "$lib/ui/animations";
  import { onDestroy } from "svelte";
  import type { LoEvent } from "$lib/services/types/presence";
  import Icon from "../icons/Icon.svelte";

  export let lo: LoEvent;

  let headingText = "";
  let cardWidths = "";
  let iconHeight = "";
  let colourPrefix = "";
  let imageHeight = "";
  let textSize = "";
  let avatarHeight = "";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      textSize = "text-xs";
      headingText = "!text-md font-medium";
      cardWidths = "w-36 h-[13rem]";
      iconHeight = "90";
      imageHeight = "h-16";
      avatarHeight = "h-10";
    } else {
      textSize = "text-base";
      headingText = "!text-lg font-semibold";
      cardWidths = "w-60 h-[21rem]";
      iconHeight = "180";
      imageHeight = "h-32";
    }
  });
  onDestroy(unsubscribe);
</script>

<a href={lo.loRoute} target="_blank" rel="noreferrer">
  <div transition:cardTransition class="card !bg-surface-50 dark:!bg-surface-700 border-y-8 border-primary-500 m-2 {cardWidths} transition-all hover:scale-105">
    <div class="flex">
      <header class="card-header flex flex-row items-center justify-between p-3">
        <Avatar src={lo.user.avatar} alt={lo.user.fullName} class="mr-2 {avatarHeight}" />
        <h6 class={textSize}>{lo.user.fullName} &nbsp &nbsp</h6>
        <div class="flex-none"><Icon type={lo.type} height="30" /></div>
      </header>
    </div>
    <div class="card-body">
      <figure class="flex justify-center object-scale-down p-1">
        {#if lo.icon}
          <Iconify icon={lo.icon.type} color="{colourPrefix}{lo.icon.color}" height={iconHeight} />
        {:else}
          <Avatar src={lo.img} alt={lo.title} width={imageHeight} rounded="rounded-xl" background="none" />
        {/if}
      </figure>
    </div>
    <footer class="card-footer">
      <div class="-m-4 mt-2 text-center">
        <div class="inline-flex w-full">
          <div class="{textSize} line-clamp-2 flex-auto font-semibold">{lo.courseTitle}</div>
        </div>
        <div class="line-clamp-1 {textSize}">
          {lo.title}
        </div>
      </div>
    </footer>
  </div>
</a>
