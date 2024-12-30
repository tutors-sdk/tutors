<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { CardDetails } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "../../services/themes.svelte";
  import { courseService } from "$lib/services/course.svelte";

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

  const hideVideoIcon = $derived(courseService.currentCourse.value?.areVideosHidden);
  const isLandscape = $derived(themeService.cardStyle.value === "landscape");

  const headingText = $derived(
    themeService.layout.value === "compacted" 
      ? isLandscape ? "!text-sm font-medium" : "!text-xs font-medium"
      : isLandscape ? "!text-xl font-semibold" : "!text-lg font-semibold"
  );

  const cardDimensions = $derived(
    themeService.layout.value === "compacted"
      ? isLandscape ? "w-[28rem] h-32" : "w-36 h-[14rem]"
      : isLandscape ? "w-[36rem] h-48" : "w-60 h-[23rem]"
  );

  const iconHeight = $derived(
    themeService.layout.value === "compacted"
      ? "60"
      : isLandscape ? "120" : "160"
  );

  const imageSize = $derived(
    themeService.layout.value === "compacted"
      ? isLandscape ? "w-32" : "h-16"
      : isLandscape ? "w-48" : "h-40"
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
        <h6 class={textSize}>{cardDetails.student?.fullName}</h6>
      </div>
    {:else}
      <div class="line-clamp-2 pr-10 !text-black dark:!text-white {headingText}">
        {cardDetails.title}
      </div>
    {/if}
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="flex h-full items-center justify-center overflow-hidden p-2">
    {#if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={iconHeight} />
    {:else}
      <img 
        src={cardDetails.img} 
        alt={cardDetails.title} 
        class="{imageSize} object-contain object-center" 
      />
    {/if}
  </figure>
{/snippet}

{#snippet content(cardDetails: CardDetails)}
  {#if isLandscape}
    <div class="flex flex-col justify-between p-4">
      {@render header(cardDetails)}
      {#if cardDetails.summary}
        <div class="{textSize} text-black dark:text-white">
          {@html cardDetails.summary}
        </div>
      {:else}
        <div class="flex flex-col">
          <div class="{textSize} font-semibold">
            {cardDetails.subtitle1}
          </div>
          <div class="{textSize}">
            {cardDetails.subtitle2}
          </div>
        </div>
      {/if}
    </div>
  {:else}
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
  {/if}
{/snippet}

<a href={cardDetails.route} {target}>
  <div
    class="card preset-filled-{themeService.getTypeColour(cardDetails.type)}-100-900 border-[1px]
    {isLandscape ? 'border-l-8' : 'border-y-8'} border-{themeService.getTypeColour(cardDetails.type)}-500 
    m-2 {cardDimensions} {isLandscape ? 'flex' : 'flex flex-col'} transition-all hover:scale-[1.02]"
  >
    {#if isLandscape}
      <div class="w-1/3">
        {@render figure(cardDetails)}
      </div>
      <div class="w-2/3">
        {@render content(cardDetails)}
      </div>
    {:else}
      <div class="card-header flex">
        {@render header(cardDetails)}
      </div>
      <div class="card-body flex flex-1 items-center justify-center">
        {@render figure(cardDetails)}
      </div>
      <div class="card-footer">
        {@render content(cardDetails)}
      </div>
    {/if}
  </div>
</a>
