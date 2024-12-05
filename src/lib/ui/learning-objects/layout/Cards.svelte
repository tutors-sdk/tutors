<script lang="ts">
  import { onMount } from "svelte";
  import { currentCourse } from "$lib/runes";
  import type { Lo } from "$lib/services/models/lo-types";
  import { setShowHide } from "$lib/services/models/lo-utils";
  import Card from "$lib/ui/components/Card.svelte";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import { scaleTransition } from "$lib/ui/themes/animations";

  interface Props {
    los?: Lo[];
    border?: boolean;
    inSidebar?: boolean;
  }
  let { los = [], border = false, inSidebar = false }: Props = $props();

  let bordered = "border-[1px] border-surface-200-700-token";
  let unbordered = "";

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
    if (currentCourse?.value?.properties.ignorepin) {
      ignorePin = currentCourse?.value?.properties.ignorepin.toString();
      window.addEventListener("keydown", keypressInput);
    }
    isLoaded = true;
  });
</script>

{#if los.length > 0 && isLoaded}
  <div
    transition:scale|local={scaleTransition}
    class="mx-auto mb-2 place-items-center overflow-hidden rounded-xl bg-surface-100 p-4 dark:bg-surface-900 {border
      ? bordered
      : unbordered}"
  >
    <div
      class={los.length > 4 && !inSidebar
        ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        : los.length > 3 && !inSidebar
          ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : los.length > 2 && !inSidebar
            ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : los.length > 1 && !inSidebar
              ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2"
              : "mx-auto flex flex-wrap justify-center"}
    >
      {#key refresh}
        {#each los as lo}
          {#if !lo.hide}
            <div class="flex justify-center">
              <Card
                cardDetails={{
                  route: lo.route,
                  title: lo.title,
                  type: lo.type,
                  summary: lo.summary,
                  img: lo.img,
                  icon: lo.icon
                }}
              />
              <!-- <Card {lo} /> -->
            </div>
          {/if}
        {/each}
      {/key}
    </div>
  </div>
{/if}
