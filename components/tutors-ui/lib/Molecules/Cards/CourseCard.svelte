<script lang="ts">
  import type { CourseSummary } from 'tutors-reader-lib/src/utils/course-utils';
  import { layout } from 'tutors-reader-lib/src/stores/stores';
  import { onDestroy } from 'svelte';
  import { cardTransition } from '../../animations';
  import Iconify from '@iconify/svelte';
  import { Avatar } from '@brainandbones/skeleton';
  import Icon from '../../Atoms/Icon/Icon.svelte';
  import { toHoursAndMinutes } from 'tutors-reader-lib/src/utils/metrics-utils';

  export let lo: CourseSummary;
  let target = '_blank';

  let headingText = '';
  let cardWidths = '';
  let iconHeight = '';
  let colourPrefix = '';
  let imageHeight = '';

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === 'compacted') {
      headingText = 'text-md font-medium';
      cardWidths = 'w-36 h-[21rem]';
      iconHeight = '90';
      imageHeight = 'h-20';
    } else {
      headingText = 'text-lg font-semibold';
      cardWidths = 'w-60 h-[25rem]';
      iconHeight = '180';
      imageHeight = 'h-48';
    }
  });

  function summarise(courseSummary: CourseSummary): string {
    let str = 'Time ';
    str += `${toHoursAndMinutes(courseSummary.count)}<br>`;
    str += 'Page Loads: ';
    str += `${courseSummary.visits}`;
    return str;
  }

  onDestroy(unsubscribe);
</script>

<a href="{lo.route}" target="{target}">
  <div
    transition:cardTransition
    class="card !bg-surface-50 dark:!bg-surface-700 border-accent-500 m-2 border-y-8 {cardWidths} transition-all hover:scale-105"
  >
    <header class="card-header flex flex-row items-center justify-between p-3">
      <div class="inline-flex w-full">
        <div class="line-clamp-2 flex-auto {headingText}">{lo.title}</div>
        <div class="flex-none"><Icon type="web" /></div>
      </div>
    </header>
    <div class="card-body">
      <figure class="flex justify-center object-scale-down p-1">
        {#if lo.icon}
          <Iconify
            icon="{lo.icon.type}"
            color="{colourPrefix}{lo.icon.color}"
            height="{iconHeight}"
          />
        {:else}
          <Avatar
            src="{lo.img}"
            alt="{lo.title}"
            width="{imageHeight}"
            rounded="rounded-xl"
            background="none"
          />
        {/if}
      </figure>
    </div>
    <footer class="card-footer">
      <div class="prose dark:prose-invert line-clamp-3 text-center">
        {@html summarise(lo)}
      </div>
    </footer>
  </div>
</a>
