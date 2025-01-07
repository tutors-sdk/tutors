<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { CardDetails } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes.svelte";
  import { currentCourse } from "$lib/runes";

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

  type CardType = "landscape" | "circular" | "portrait";
  const cardType = $derived(themeService.cardStyle.value as CardType);
  const hideVideoIcon = $derived(currentCourse.value?.areVideosHidden);
  const hasFullName = $derived(cardDetails?.student?.fullName);

  const compactHeadingStyles = {
    landscape: "text-sm font-medium",
    circular: "text-xs font-medium",
    portrait: "text-xs font-medium"
  };

  const expandedHeadingStyles = {
    landscape: "text-xl font-semibold",
    circular: "text-lg font-semibold",
    portrait: "text-lg font-semibold"
  };

  const headingText = $derived(
    themeService.layout.value === "compacted" ? compactHeadingStyles[cardType] : expandedHeadingStyles[cardType]
  );

  const cardDimensions = $derived(
    themeService.layout.value === "compacted"
      ? {
          landscape: "w-[20rem] h-32",
          circular: "w-48 h-48",
          portrait: "w-36 h-[14rem]"
        }[cardType]
      : {
          landscape: "w-[28rem] h-48",
          circular: "w-64 h-64",
          portrait: "w-60 h-[23rem]"
        }[cardType]
  );

  type IconHeightMap = Record<CardType, string>;
  const iconHeightMap: IconHeightMap = {
    landscape: "80",
    circular: "48",
    portrait: "80"
  };

  const iconHeight = $derived(
    themeService.layout.value === "compacted"
      ? iconHeightMap[cardType]
      : {
          landscape: "160",
          circular: "160",
          portrait: "160"
        }[cardType]
  );

  type ImageSizeMap = Record<CardType, string>;
  const imageSizeMap: ImageSizeMap = {
    landscape: "w-32",
    circular: "w-24 h-24",
    portrait: "h-16"
  };

  const imageSize = $derived(
    themeService.layout.value === "compacted"
      ? imageSizeMap[cardType]
      : {
          landscape: "w-48",
          circular: "w-32 h-32",
          portrait: "h-40"
        }[cardType]
  );

  const textSize = $derived(
    themeService.layout.value === "compacted"
      ? "line-clamp-2 text-xs"
      : "prose line-clamp-3 leading-6 dark:prose-invert"
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
        <h6 class={textSize}>&nbsp;{hasFullName ? cardDetails.student?.fullName : cardDetails.student?.id}</h6>
      </div>
    {:else}
      <div class="line-clamp-2 pr-10 {headingText}">
        {cardDetails.title}
      </div>
    {/if}
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="flex items-center justify-center">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={iconHeight} />
    {:else}
      <img
        src={cardDetails.img}
        alt={cardDetails.title}
        class="{imageSize} object-contain object-center {cardType === 'circular' ? 'rounded-full' : ''}"
      />
    {/if}
  </figure>
{/snippet}

{#snippet content(cardDetails: CardDetails)}
  <div class="flex flex-col justify-between p-4 {cardType !== 'landscape' ? 'text-center' : ''}">
    <div class="{textSize} text-black dark:text-white">
      {@html cardDetails.summary}
      {cardDetails.summaryEx}
    </div>
  </div>
{/snippet}

{#snippet portrait(cardDetails: CardDetails)}
  <div class="card-header flex">
    {@render header(cardDetails)}
  </div>
  <div class="card-body flex flex-1 items-center justify-center">
    {@render figure(cardDetails)}
  </div>
  <div class="card-footer">
    {@render content(cardDetails)}
  </div>
{/snippet}

{#snippet circular(cardDetails: CardDetails)}
  <div class="relative flex h-full flex-col items-center justify-center p-4 text-center">
    <div class="text-l absolute left-0 right-0 top-8 line-clamp-1 px-2 font-semibold">
      {cardDetails.title}
    </div>
    <div class="mt-8 flex flex-1 items-center justify-center">
      {@render figure(cardDetails)}
    </div>
    <div class="mb-2">
      <Iconify
        icon={themeService.getIcon(cardDetails.type).type}
        color="rgb(var(--color-{themeService.getTypeColour(cardDetails.type)}-500))"
        height="30"
      />
    </div>
  </div>
{/snippet}

{#snippet landscape(cardDetails: CardDetails)}
  <div class="flex h-full w-1/3 items-center">
    {@render figure(cardDetails)}
  </div>
  <div class="w-2/3">
    {@render header(cardDetails)}
    {@render content(cardDetails)}
  </div>
{/snippet}

<a href={cardDetails.route} {target}>
  <div
    class="card preset-filled-{themeService.getTypeColour(cardDetails.type)}-100-900 border-[1px]
    {cardType === 'landscape'
      ? 'border-l-8'
      : cardType === 'circular'
        ? 'rounded-full border-4'
        : 'border-y-8'} border-{themeService.getTypeColour(cardDetails.type)}-500
    m-2 {cardDimensions} {cardType === 'landscape' ? 'flex' : 'flex flex-col'} transition-all hover:scale-[1.10]"
  >
    {#if cardType === "landscape"}
      {@render landscape(cardDetails)}
    {:else if cardType === "circular"}
      {@render circular(cardDetails)}
    {:else}
      {@render portrait(cardDetails)}
    {/if}
  </div>
</a>
