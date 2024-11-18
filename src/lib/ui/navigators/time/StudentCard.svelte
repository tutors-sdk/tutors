<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import Iconify from "@iconify/svelte";
  import { cardTransition } from "$lib/ui/animations";
  import { onDestroy } from "svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import type { LoRecord } from "$lib/services/types.svelte";

  export let lo: LoRecord;

  let textSize = "text-base";
  let headingText = "!text-lg font-semibold";
  let cardWidths = "w-60 h-[21rem]";
  let iconHeight = "180";
  let imageHeight = "h-32";
  let avatarHeight = "h-10";
</script>

<a href={lo.loRoute} target="_blank" rel="noreferrer">
  <div
    transition:cardTransition
    class="card m-2 border-y-8 border-primary-500 !bg-surface-50 dark:!bg-surface-700 {cardWidths} transition-all hover:scale-105"
  >
    <div class="flex">
      <header class="card-header flex flex-row items-center justify-between p-3">
        <Avatar src={lo?.user?.avatar} alt={lo.user?.fullName} class="mr-2 {avatarHeight}" />
        <h6 class={textSize}>{lo?.user?.fullName} &nbsp &nbsp</h6>
        <div class="flex-none"><Icon type={lo.type} height="30" /></div>
      </header>
    </div>
    <div class="card-body">
      <figure class="flex justify-center object-scale-down p-1">
        {#if lo.icon}
          <Iconify icon={lo.icon.type} color={lo.icon.color} height={iconHeight} />
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
