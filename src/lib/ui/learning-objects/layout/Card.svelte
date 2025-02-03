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
      <img
        src={cardDetails.student.avatar}
        alt={cardDetails.student.fullName}
        class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : 'rounded-xl'}"
      />
    {:else if cardDetails.icon}
      <Iconify icon={cardDetails.icon.type} color={cardDetails.icon.color} height={styles.icon} />
    {:else}
      <img
        src={cardDetails.img}
        alt=""
        class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : ''}"
      />
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
  <div class="ml-2 flex h-full w-1/3 items-center">
    {@render figure(cardDetails)}
  </div>
  <div class="relative w-2/3">
    {@render header(cardDetails)}
    {@render content(cardDetails)}
    <div class="absolute bottom-1 right-2 text-xs text-gray-400">{cardDetails.metric}</div>
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
