<script lang="ts">
  import { onMount } from "svelte";

  import type { Lo } from "$lib/services/models/lo-types";
  import { setShowHide } from "$lib/services/models/lo-utils";
  import Card from "$lib/ui/components/Card.svelte";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import { scaleTransition } from "$lib/ui/themes/animations";
  import { courseService } from "$lib/services/course.svelte";
  import { themeService } from "$lib/services/themes.svelte";
  import LandscapeCard from "$lib/ui/components/LandscapeCard.svelte";

  interface Props {
    los?: Lo[];
  }
  let { los = [] }: Props = $props();

  let pinBuffer = "";
  let ignorePin = "";
  let refresh = $state(true);
  let isLoaded = $state(false);

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      los.forEach((lo) => {
        lo.hide = false;
        setShowHide(lo, false);
      });
      refresh = !refresh;
    }
  }

  onMount(async () => {
    if (courseService.currentCourse?.value?.properties.ignorepin) {
      ignorePin = courseService.currentCourse?.value?.properties.ignorepin.toString();
      window.addEventListener("keydown", keypressInput);
    }
    isLoaded = true;
  });
</script>

{#if los.length > 0 && isLoaded}
  <div
    transition:scale|local={scaleTransition}
    class="mx-auto mb-2 place-items-center overflow-hidden rounded-xl bg-surface-100 p-4 dark:bg-surface-900"
  >
    <div class="mx-auto flex flex-wrap justify-center">
      {#key refresh}
        {#each los as lo}
          {#if !lo.hide}
            <div class="flex justify-center">
              {#if themeService.cardStyle.value === "landscape"}
                <LandscapeCard
                  cardDetails={{
                    route: lo.route,
                    title: lo.title,
                    type: lo.type,
                    subtitle1: lo.credits,
                    subtitle2: lo.summary,
                    summary: lo.summary,
                    icon: lo.icon,
                    img: lo.img,
                    video: lo.video
                  }}
                />
              {:else}
                <Card
                  cardDetails={{
                    route: lo.route,
                    title: lo.title,
                    type: lo.type,
                    subtitle1: lo.credits,
                    subtitle2: lo.summary,
                    summary: lo.summary,
                    icon: lo.icon,
                    img: lo.img,
                    video: lo.video
                  }}
                />
              {/if}
            </div>
          {/if}
        {/each}
      {/key}
    </div>
  </div>
{/if}
