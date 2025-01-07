<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { CardDetails, CardStyleType, LayoutType } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes";
  import { themeService } from "$lib/services/themes.svelte";

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
  const isPortrait = $derived(themeService.cardStyle.value === "portrait");
  const isLandscape = $derived(themeService.cardStyle.value === "landscape");
  const isCircular = $derived(themeService.cardStyle.value === "circular");
  const hasFullName = $derived(cardDetails?.student?.fullName);

  type CardStyles = Record<LayoutType, Record<CardStyleType, string>>;

  const headdingTextStyles: CardStyles = {
    expanded: {
      portrait: "!text-lg font-medium",
      landscape: "!text-lg font-semibold",
      circular: "!text-lg font-semibold"
    },
    compacted: {
      portrait: "!text-xs font-medium",
      landscape: "!text-md font-medium",
      circular: "!text-sm font-medium"
    }
  };

  const cardDimensionStyles: CardStyles = {
    expanded: {
      portrait: "w-60 h-[23rem]",
      landscape: "w-[28rem] h-48",
      circular: "w-64 h-64"
    },
    compacted: {
      portrait: "w-36 h-[14rem]",
      landscape: "w-[20rem] h-32",
      circular: "w-48 h-48"
    }
  };

  const imageSizeStyles: CardStyles = {
    expanded: {
      portrait: "h-40",
      landscape: "w-48",
      circular: "w-32 h-32"
    },
    compacted: {
      portrait: "h-16",
      landscape: "w-32",
      circular: "w-24 h-24"
    }
  };

  const iconSizeStyles: CardStyles = {
    expanded: {
      portrait: "160",
      landscape: "120",
      circular: "120"
    },
    compacted: {
      portrait: "60",
      landscape: "60",
      circular: "60"
    }
  };

  const iconHeightStyles: CardStyles = {
    expanded: {
      portrait: "30",
      landscape: "40",
      circular: "50"
    },
    compacted: {
      portrait: "20",
      landscape: "20",
      circular: "20"
    }
  };

  const textSizeStyles: CardStyles = {
    expanded: {
      portrait: "prose line-clamp-3 leading-6 dark:prose-invert",
      landscape: "prose line-clamp-3 leading-6 dark:prose-invert",
      circular: "prose line-clamp-3 leading-6 dark:prose-invert"
    },
    compacted: {
      portrait: "line-clamp-2 text-xs",
      landscape: "line-clamp-2 text-xs",
      circular: "line-clamp-2 text-xs"
    }
  };

  const avatarWidthStyles: CardStyles = {
    expanded: {
      portrait: "w-12",
      landscape: "w-12",
      circular: "w-12"
    },
    compacted: {
      portrait: "w-8",
      landscape: "w-8",
      circular: "w-8"
    }
  };

  const cardContainerStyles: CardStyles = {
    expanded: {
      portrait: "border-y-8 flex flex-col",
      landscape: "border-l-8 flex",
      circular: "rounded-full border-4 flex flex-col"
    },
    compacted: {
      portrait: "border-y-8 flex flex-col",
      landscape: "border-l-8 flex",
      circular: "rounded-full border-4 flex flex-col"
    }
  };

  const styles = $derived({
    heading: headdingTextStyles[themeService.layout.value][themeService.cardStyle.value],
    dimensions: cardDimensionStyles[themeService.layout.value][themeService.cardStyle.value],
    image: imageSizeStyles[themeService.layout.value][themeService.cardStyle.value],
    icon: iconSizeStyles[themeService.layout.value][themeService.cardStyle.value],
    iconHeight: iconHeightStyles[themeService.layout.value][themeService.cardStyle.value],
    text: textSizeStyles[themeService.layout.value][themeService.cardStyle.value],
    avatar: avatarWidthStyles[themeService.layout.value][themeService.cardStyle.value],
    container: cardContainerStyles[themeService.layout.value][themeService.cardStyle.value]
  });
</script>

{#snippet header(cardDetails: CardDetails)}
  <header class="relative w-full p-3">
    <div class="absolute right-1 top-3 flex items-center">
      {#if cardDetails.video && cardDetails.type !== "video" && !hideVideoIcon}
        <a href={cardDetails.video}>
          <Icon type="video" height="30" />
        </a>
      {/if}
      <Icon type={cardDetails.type} height={styles.iconHeight} />
    </div>
    {#if cardDetails.student}
      <div class="flex items-center">
        <img src={cardDetails.student.avatar} alt={cardDetails.student.fullName} class="rounded-3xl {styles.avatar}" />
        <h6 class={styles.text}>&nbsp;{hasFullName ? cardDetails.student?.fullName : cardDetails.student?.id}</h6>
      </div>
    {:else}
      <div class="line-clamp-2 pr-10 {styles.heading}">
        {cardDetails.title}
      </div>
    {/if}
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="flex items-center justify-center">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={styles.icon} />
    {:else}
      <img
        src={cardDetails.img}
        alt={cardDetails.title}
        class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : ''}"
      />
    {/if}
  </figure>
{/snippet}

{#snippet content(cardDetails: CardDetails)}
  <div class="flex flex-col justify-between p-4 {!isLandscape ? 'text-center' : ''}">
    <div class="{styles.text} ">
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
    <div class="text-l absolute left-0 right-0 top-8 line-clamp-1 px-2 {styles.heading}">
      {cardDetails.title}
    </div>
    <div class="mt-8 flex flex-1 items-center justify-center">
      {@render figure(cardDetails)}
    </div>
    <div class="mb-2">
      <Icon type={cardDetails.type} height={styles.iconHeight} />
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
    {styles.container} border-{themeService.getTypeColour(cardDetails.type)}-500
    m-2 {styles.dimensions} transition-all hover:scale-[1.10]"
  >
    {#if isLandscape}
      {@render landscape(cardDetails)}
    {:else if isCircular}
      {@render circular(cardDetails)}
    {:else if isPortrait}
      {@render portrait(cardDetails)}
    {/if}
  </div>
</a>
