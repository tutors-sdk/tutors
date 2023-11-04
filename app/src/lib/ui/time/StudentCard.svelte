<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import Iconify from "@iconify/svelte";
  import { layout } from "$lib/stores";
  import { cardTransition } from "$lib/ui/animations";
  import { onDestroy } from "svelte";
  import type { LoEvent } from "$lib/services/types/presence";

  export let lo: LoEvent;

  let headingText = "";
  let cardWidths = "";
  let iconHeight = "";
  let colourPrefix = "";
  let imageHeight = "";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      headingText = "!text-md font-medium";
      cardWidths = "w-36 h-[13rem]";
      iconHeight = "90";
      imageHeight = "h-20";
    } else {
      headingText = "!text-lg font-semibold";
      cardWidths = "w-60 h-[21rem]";
      iconHeight = "180";
      imageHeight = "h-48";
    }
  });
  onDestroy(unsubscribe);
</script>

<a href="https://tutors.dev{lo.loRoute}" target="_blank" rel="noreferrer">
  <div transition:cardTransition class="card !bg-surface-50 dark:!bg-surface-700 border-y-8 border-primary-500 m-2 w-56 {cardWidths} transition-all hover:scale-105">
    <div class="flex">
      <header class="card-header inline-flex items-center">
        <Avatar src={lo.user.avatar} alt={lo.user.fullName} class="mr-2" />
        <h6>{lo.user.fullName}</h6>
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
        <div class="line-clamp-1">
          {lo.title}
        </div>
      </div>
    </footer>
  </div>
</a>
