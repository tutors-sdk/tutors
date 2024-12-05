<script lang="ts">
  import Iconify from "@iconify/svelte";

  import {
    layout,
    avatarWidth,
    cardHeight,
    cardWidths,
    headingText,
    iconHeight,
    imageHeight,
    textSize
  } from "$lib/runes";

  import { getTypeColour } from "../themes/theme-controller";
  import type { CardDetails } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  let { cardDetails } = $props<{ cardDetails: CardDetails }>();
  let target = $state("");
  if (cardDetails.type === "web") {
    if (cardDetails.route.startsWith("http")) {
      target = "_blank";
    }
  }

  if (cardDetails) {
    if (cardDetails.type == "video") {
      cardDetails.route = cardDetails.video!;
    }
  }

  $effect(() => {
    if (layout.value === "compacted") {
      cardHeight.value = "h-48";
      headingText.value = "!text-xs font-medium";
      cardWidths.value = "w-36 h-[18rem]";
      iconHeight.value = "60";
      imageHeight.value = "h-12";
      textSize.value = "line-clamp-2 text-xs";
      avatarWidth.value = "w-8";
    } else {
      cardHeight.value = "h-96";
      headingText.value = "!text-lg font-semibold";
      cardWidths.value = "w-60 h-[23rem]";
      iconHeight.value = "140";
      imageHeight.value = "h-40";
      textSize.value = "prose mt-4 line-clamp-3 leading-6 dark:prose-invert";
      avatarWidth.value = "w-12";
    }
  });
</script>

{#snippet header(cardDetails: CardDetails)}
  <header class="relative w-full p-3">
    <div class="absolute right-3 top-3">
      <Icon type={cardDetails.type} height="30" />
    </div>
    {#if cardDetails.student}
      <div class="flex items-center">
        <img
          src={cardDetails.student.avatar}
          alt={cardDetails.student.fullName}
          class="rounded-3xl {avatarWidth.value}"
        />
        <h6 class={textSize.value}>{cardDetails.student?.fullName}</h6>
      </div>
    {:else}
      <div class="line-clamp-2 pr-10 !text-lg font-semibold !text-black dark:!text-white {headingText.value}">
        {cardDetails.title}
      </div>
    {/if}
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="object-scale-down p-1">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={iconHeight.value} />
    {:else}
      <img src={cardDetails.img} alt={cardDetails.title} class={imageHeight.value} />
    {/if}
  </figure>
{/snippet}

{#snippet footer(cardDetails: CardDetails)}
  {#if cardDetails.summary}
    <div class="{textSize.value} text-center text-black dark:text-white">
      {@html cardDetails.summary}
    </div>
  {:else}
    <div class="pb-2 text-center">
      <div class="inline-flex w-full items-end justify-center">
        <div class="{textSize.value} line-clamp-1 flex-auto font-semibold">
          {cardDetails.subtitle1}
        </div>
      </div>
      <div class="line-clamp-1 {textSize.value}">
        {cardDetails.subtitle2}
      </div>
    </div>
  {/if}
{/snippet}

<a href={cardDetails.route} {target}>
  <div
    class="card preset-filled-{getTypeColour(cardDetails.type)}-100-900 border-[1px]
    border-y-8 border-{getTypeColour(
      cardDetails.type
    )}-500 m-2 {cardWidths.value} transition-all hover:scale-105 {cardHeight.value}
    flex flex-col"
  >
    <div class="card-header flex">
      {@render header(cardDetails)}
    </div>
    <div class="card-body flex flex-1 items-center justify-center">
      {@render figure(cardDetails)}
    </div>
    <footer class="card-footer p-2">
      {@render footer(cardDetails)}
    </footer>
  </div>
</a>
