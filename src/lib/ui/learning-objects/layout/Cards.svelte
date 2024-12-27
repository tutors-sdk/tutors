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
    class="mx-auto mb-2 place-items-center overflow-hidden rounded-xl bg-surface-100 p-4 dark:bg-surface-900"
  >
    <div class="mx-auto flex flex-wrap justify-center">
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
                  icon: lo.icon,
                  video: lo.video
                }}
              />
            </div>
          {/if}
        {/each}
      {/key}
    </div>
  </div>
{/if}
