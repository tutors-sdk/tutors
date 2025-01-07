<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { CardDetails } from "$lib/services/types.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes";
  import { themeService } from "$lib/services/themes.svelte";
  import { cardStyles } from "./card-styles";

  let { cardDetails } = $props<{ cardDetails: CardDetails }>();

  const target = $derived(cardDetails.type === "web" && cardDetails.route.startsWith("http") ? "_blank" : "");
  const route = $derived(cardDetails.type === "video" ? cardDetails.video! : cardDetails.route);
  const hideVideoIcon = $derived(currentCourse.value?.areVideosHidden);
  const isPortrait = $derived(themeService.cardStyle.value === "portrait");
  const isLandscape = $derived(themeService.cardStyle.value === "landscape");
  const isCircular = $derived(themeService.cardStyle.value === "circular");
  const hasFullName = $derived(cardDetails?.student?.fullName);

  const styles = $derived({
    heading: cardStyles.heading[themeService.layout.value][themeService.cardStyle.value],
    dimensions: cardStyles.dimensions[themeService.layout.value][themeService.cardStyle.value],
    image: cardStyles.image[themeService.layout.value][themeService.cardStyle.value],
    icon: cardStyles.icon[themeService.layout.value][themeService.cardStyle.value],
    iconHeight: cardStyles.iconHeight[themeService.layout.value][themeService.cardStyle.value],
    text: cardStyles.text[themeService.layout.value][themeService.cardStyle.value],
    avatar: cardStyles.avatar[themeService.layout.value][themeService.cardStyle.value],
    container: cardStyles.container[themeService.layout.value][themeService.cardStyle.value]
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

<a href={route} {target}>
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
