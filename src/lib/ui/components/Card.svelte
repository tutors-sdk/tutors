<script lang="ts">
  import Iconify from "@iconify/svelte";
  import { currentCourse } from "$lib/runes";

  import type { CardDetails } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "../../services/themes.svelte";

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

  const hideVideoIcon = $derived(currentCourse.value?.areVideosHidden);

  const headingText = $derived(
    themeService.layout.value === "compacted" ? "!text-xs font-medium" : "!text-lg font-semibold"
  );
  const cardSize = $derived(themeService.layout.value === "compacted" ? "w-36 h-[14rem]" : "w-60 h-[23rem]");
  const iconHeight = $derived(themeService.layout.value === "compacted" ? "60" : "160");
  const imageHeight = $derived(themeService.layout.value === "compacted" ? "h-16" : "h-40");
  const textSize = $derived(
    themeService.layout.value === "compacted"
      ? "line-clamp-2 text-xs"
      : "prose mt-4 line-clamp-3 leading-6 dark:prose-invert"
  );
  const avatarWidth = $derived(themeService.layout.value === "compacted" ? "w-8" : "w-12");
</script>

{#snippet header(cardDetails: CardDetails)}
  <header class="relative w-full p-3">
    <div class="absolute right-1 top-3 flex items-center">
      {#if cardDetails.video && cardDetails.type !== "video" && !hideVideoIcon}
        <a href={cardDetails.video}>
          <Icon type="video" height="30" />
        </a>
      {/if}
      <Icon type={cardDetails.type} height="30" />
    </div>
    {#if cardDetails.student}
      <div class="flex items-center">
        <img src={cardDetails.student.avatar} alt={cardDetails.student.fullName} class="rounded-3xl {avatarWidth}" />
        <h6 class={textSize}>{cardDetails.student?.fullName}</h6>
      </div>
    {:else}
      <div class="line-clamp-2 pr-10 !text-lg font-semibold !text-black dark:!text-white {headingText}">
        {cardDetails.title}
      </div>
    {/if}
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="flex items-center justify-center overflow-hidden p-2">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={iconHeight} />
    {:else}
      <img src={cardDetails.img} alt={cardDetails.title} class="{imageHeight} object-contain object-center" />
    {/if}
  </figure>
{/snippet}

{#snippet footer(cardDetails: CardDetails)}
  {#if cardDetails.summary}
    <div class="{textSize} text-center text-black dark:text-white">
      {@html cardDetails.summary}
    </div>
  {:else}
    <div class="pb-2 text-center">
      <div class="inline-flex w-full items-end justify-center">
        <div class="{textSize} line-clamp-1 flex-auto font-semibold">
          {cardDetails.subtitle1}
        </div>
      </div>
      <div class="line-clamp-1 {textSize}">
        {cardDetails.subtitle2}
      </div>
    </div>
  {/if}
{/snippet}

<a href={cardDetails.route} {target}>
  <div
    class="card preset-filled-{themeService.getTypeColour(cardDetails.type)}-100-900 border-[1px]
    border-y-8 border-{themeService.getTypeColour(cardDetails.type)}-500 m-2 {cardSize} transition-all hover:scale-105"
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
