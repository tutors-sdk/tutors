<script lang="ts">
  import Iconify from "@iconify/svelte";
  import type { LoEvent } from "$lib/services/community";
  import { cardStyles, type CardConfig } from "$lib/services/themes";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";

  let { lo, cardLayout, showCourseTitle = false } = $props<{
    lo: LoEvent;
    cardLayout?: CardConfig;
    showCourseTitle?: boolean;
  }>();

  const student = $derived(lo.user!);
  const target = $derived(lo.type === "web" && lo.loRoute.startsWith("http") ? "_blank" : "");
  const route = $derived(lo.loRoute);
  const layout = $derived(cardLayout?.layout ?? themeService.layout.value);
  const style = $derived(cardLayout?.style ?? themeService.cardStyle.value);
  const sentiment = $derived(student.sentiment ?? "neutral");
  const isLandscape = $derived(style === "landscape");
  const isCircular = $derived(style === "circular");

  const primaryLine = $derived(
    showCourseTitle ? lo.courseTitle : lo.title
  );
  const secondaryLine = $derived(
    showCourseTitle ? `${lo.title}` : ""
  );

  const styles = $derived({
    heading: cardStyles.heading[layout][style],
    dimensions: cardStyles.dimensions[layout][style],
    image: cardStyles.image[layout][style],
    icon: cardStyles.icon[layout][style],
    iconHeight: cardStyles.iconHeight[layout][style],
    text: cardStyles.text[layout][style],
    container: cardStyles.container[layout][style]
  });

  const cardShellClass = $derived(
    `card preset-filled-${themeService.getTypeColour(lo.type)}-100-900 border-[1px] ` +
      `${styles.container} border-${themeService.getTypeColour(lo.type)}-500 ` +
      `m-2 ${styles.dimensions} transition-all hover:scale-[1.10]`
  );
</script>

<div class={cardShellClass}>
  <div class="flex h-full w-full flex-col">
    <div
      class="relative flex w-full shrink-0 items-center justify-center border-surface-300 border-b px-3 py-3 dark:border-surface-600"
    >
      <span class="absolute top-1/2 left-3 z-10 -translate-y-1/2">
        <Icon type={sentiment} tip={`Sentiment — ${sentiment}.`} height="28" />
      </span>
      {#if student.id}
        <a
          href="https://github.com/{student.id}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:text-primary-dark line-clamp-1 min-w-0 max-w-full px-12 text-center {styles.heading} relative z-20 underline underline-offset-2 transition-colors"
        >
          {student.fullName ?? student.id}
        </a>
      {:else}
        <span class="line-clamp-1 min-w-0 max-w-full px-12 text-center {styles.heading}">
          {student.fullName}
        </span>
      {/if}
      <span class="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap">
        <span>{lo.type}</span><Icon type={lo.type} height={styles.iconHeight} />
      </span>
    </div>
    <a href={route} target={target || undefined} class="text-inherit relative flex min-h-0 flex-1 gap-1 no-underline">
      <div class="ml-2 flex h-full w-[26%] min-w-0 shrink-0 items-center justify-center">
        <figure class="flex items-center justify-center">
          <img
            src={student.avatar}
            alt={student.fullName}
            class="{styles.image} object-contain object-center {isCircular ? 'rounded-full' : 'rounded-xl'}"
          />
        </figure>
      </div>
      <div class="relative flex min-w-0 flex-1 flex-col pr-2">
        <div class="min-h-0 flex-1 overflow-auto">
          <div class="flex flex-col justify-between p-4 {!isLandscape ? 'text-center' : ''}">
            <div class="text-primary hover:text-primary-dark {styles.heading}">
              {primaryLine}
            </div>
            {#if secondaryLine}
              <div class="{styles.text} ">
                {secondaryLine}
              </div>
            {/if}
          </div>
        </div>
      </div>
      <div class="mr-2 flex h-full w-[26%] min-w-0 shrink-0 items-center justify-center py-2">
        {#if lo.img}
          <img
            src={lo.img}
            alt=""
            class="{styles.image} max-h-full w-full object-contain object-center rounded-xl"
          />
        {:else if lo.icon}
          <Iconify icon={lo.icon.type} color={lo.icon.color} height={styles.icon} />
        {/if}
      </div>
    </a>
  </div>
</div>
