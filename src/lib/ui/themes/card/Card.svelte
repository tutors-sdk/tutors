<script lang="ts">
  import Iconify from "@iconify/svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { layout, avatarWidth, cardHeight, cardWidths, headingText, iconHeight, imageWidth, textSize } from "$lib/runes";

  import { getTypeColour } from "../styles/icon-lib.svelte";
  import type { CardDetails } from "$lib/services/types.svelte";

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
      cardHeight.value = "200px";  
      headingText.value = "!text-sm font-medium";
      cardWidths.value = "w-36 h-[18rem]";
      iconHeight.value = "100";
      imageWidth.value = "w-24";
      textSize.value = "text-sm";
      avatarWidth.value = "w-8"; 
    } else {
      cardHeight.value = "380px"; 
      headingText.value = "!text-lg font-semibold"; 
      cardWidths.value = "w-60 h-[21rem]";
      iconHeight.value = "140"; 
      imageWidth.value = "w-36";
      textSize.value = "text-base";
      avatarWidth.value = "w-12"; 
    }
  });
</script>

{#snippet header(cardDetails: CardDetails)}
  <header class="flex flex-row items-center justify-between p-3">
    {#if cardDetails.student}
      <img
        src={cardDetails.student.avatar}
        alt={cardDetails.student.fullName}
        class="rounded-3xl {avatarWidth.value}"
      />
    {:else}
      <div class="line-clamp-2 flex-auto !text-lg font-semibold !text-black dark:!text-white {headingText.value}">
        {cardDetails.title}
      </div>
    {/if}
    <h6 class={textSize.value}>{cardDetails.student?.fullName} &nbsp &nbsp</h6>
    <div class="flex-none"><Icon type={cardDetails.type} height="30" /></div>
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="object-scale-down p-1">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={iconHeight.value} />
    {:else}
      <img src={cardDetails.img} alt={cardDetails.title} class={imageWidth.value} />
    {/if}
  </figure>
{/snippet}

{#snippet footer(cardDetails: CardDetails)}
  {#if cardDetails.summary}
    <div class="prose mt-4 line-clamp-3 text-center leading-6 dark:prose-invert">
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
    class="card preset-filled-{getTypeColour(cardDetails.type)}-50-950 border-[1px]
    border-y-8 border-{getTypeColour(
      cardDetails.type
    )}-500 m-2 {cardWidths.value} transition-all hover:scale-105 h-[{cardHeight.value}]
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
