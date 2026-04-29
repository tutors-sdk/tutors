<script lang="ts">
  import Iconify from "@iconify/svelte";
  import { cardStyles, type CardConfig, type CardDetails } from "$lib/services/themes";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";

  let { cardDetails, cardLayout } = $props<{ cardDetails: CardDetails; cardLayout?: CardConfig }>();

  const target = $derived(cardDetails.type === "web" && cardDetails.route.startsWith("http") ? "_blank" : "");
  const route = $derived(cardDetails.type === "video" ? cardDetails.video! : cardDetails.route);
  const hideVideoIcon = $derived(currentCourse.value?.areVideosHidden);
  const layout = $derived(cardLayout?.layout ?? themeService.layout.value);
  const style = $derived(cardLayout?.style ?? themeService.cardStyle.value);
  const sentiment = $derived(cardDetails.student?.sentiment ?? "neutral");
  const isPortrait = $derived(style === "portrait");
  const isLandscape = $derived(style === "landscape");
  const isCircular = $derived(style === "circular");

  const styles = $derived({
    heading: cardStyles.heading[layout][style],
    dimensions: cardStyles.dimensions[layout][style],
    image: cardStyles.image[layout][style],
    icon: cardStyles.icon[layout][style],
    iconHeight: cardStyles.iconHeight[layout][style],
    text: cardStyles.text[layout][style],
    avatar: cardStyles.avatar[layout][style],
    container: cardStyles.container[layout][style]
  });

  const cardShellClass = $derived(
    `card preset-filled-${themeService.getTypeColour(cardDetails.type)}-100-900 border-[1px] ` +
      `${styles.container} border-${themeService.getTypeColour(cardDetails.type)}-500 ` +
      `m-2 ${styles.dimensions} transition-all hover:scale-[1.10]`
  );
</script>

{#snippet header(cardDetails: CardDetails)}
  <header class="relative w-full p-3">
    <div class="absolute top-3 right-1 flex items-center">
      {#if cardDetails.video && cardDetails.type !== "video" && !hideVideoIcon}
        <a href={cardDetails.video}>
          <Icon type="video" height="30" />
        </a>
      {/if}
      <Icon type={cardDetails.type} height={styles.iconHeight} />
    </div>
    <div class="line-clamp-2 pr-10 {styles.heading}">
      {#if cardDetails.student}
        <div class="flex items-center justify-between">
          <span>
            <img src={cardDetails.img} alt="" class="rounded-xl {styles.avatar}" />
          </span>
          <span>
            <h6 class={styles.text}>&nbsp;{cardDetails.student.fullName ?? cardDetails.student.id}</h6>

          </span>
        </div>
      {:else}
        {cardDetails.title}
      {/if}
    </div>
  </header>
{/snippet}

{#snippet figure(cardDetails: CardDetails)}
  <figure class="flex items-center justify-center">
    {#if cardDetails.student}
      <img src={cardDetails.student.avatar} alt={cardDetails.student.fullName} class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : 'rounded-xl'}" />
    {:else if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={styles.icon} />
    {:else}
      <img src={cardDetails.img} alt="" class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : ''}" />
    {/if}
  </figure>
{/snippet}

{#snippet content(cardDetails: CardDetails)}
  <div class="flex flex-col justify-between p-4 {!isLandscape ? 'text-center' : ''}">
    <div class="{styles.text} ">
      {@html cardDetails.summary}
    </div>
    <div class="{styles.text} ">
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
    <div class="text-l absolute top-8 right-0 left-0 line-clamp-1 px-2 {styles.heading}">
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
  <div class="ml-2 flex h-full w-1/3 items-center">
    {@render figure(cardDetails)}
  </div>
  <div class="relative w-2/3">
    {@render header(cardDetails)}
    {@render content(cardDetails)}
    <div class="absolute right-2 bottom-1 text-xs text-gray-400">{cardDetails.metric}</div>
  </div>
{/snippet}

{#snippet student(cardDetails: CardDetails)}
  <div class="flex h-full w-full flex-col">
    <div
      class="relative flex w-full shrink-0 items-center justify-center border-surface-300 border-b px-3 py-3 dark:border-surface-600"
    >
      <span class="absolute top-1/2 left-3 z-10 -translate-y-1/2">
        <Icon type={sentiment} tip={`Sentiment — ${sentiment}.`} height="28" />
      </span>
      {#if cardDetails.student?.id}
        <a
          href="https://github.com/{cardDetails.student.id}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:text-primary-dark line-clamp-1 min-w-0 max-w-full px-12 text-center {styles.heading} relative z-20 underline underline-offset-2 transition-colors"
        >
          {cardDetails.student.fullName ?? cardDetails.student.id}
        </a>
      {:else}
        <span class="line-clamp-1 min-w-0 max-w-full px-12 text-center {styles.heading}">
          {cardDetails.student?.fullName}
        </span>
      {/if}
      <span class="absolute top-1/2 right-3 z-10 -translate-y-1/2">
        <Icon type={cardDetails.type} height={styles.iconHeight} />
      </span>
    </div>
    <a href={route} target={target || undefined} class="text-inherit relative flex min-h-0 flex-1 gap-1 no-underline">
      <div class="ml-2 flex h-full w-[26%] min-w-0 shrink-0 items-center justify-center">
        {@render figure(cardDetails)}
      </div>
      <div class="relative flex min-w-0 flex-1 flex-col pr-2">
        <div class="min-h-0 flex-1 overflow-auto">
          {@render content(cardDetails)}
        </div>
      </div>
      <div class="mr-2 flex h-full w-[26%] min-w-0 shrink-0 items-center justify-center py-2">
        {#if cardDetails.img}
          <img
            src={cardDetails.img}
            alt=""
            class="{styles.image} max-h-full w-full object-contain object-center rounded-xl"
          />
        {:else if cardDetails.icon}
          <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={styles.icon} />
        {/if}
      </div>
    </a>
  </div>
{/snippet}

{#if cardDetails.student}
  <div class={cardShellClass}>
    {@render student(cardDetails)}
  </div>
{:else}
  <a href={route} {target}>
    <div class={cardShellClass}>
      {#if isLandscape}
        {@render landscape(cardDetails)}
      {:else if isCircular}
        {@render circular(cardDetails)}
      {:else if isPortrait}
        {@render portrait(cardDetails)}
      {/if}
    </div>
  </a>
{/if}
