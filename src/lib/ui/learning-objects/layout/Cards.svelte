<script lang="ts">
  import { onMount } from "svelte";

  import type { Lo } from "$lib/services/base";

  import Card from "$lib/ui/learning-objects/layout/Card.svelte";
  import { cubicOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import { scaleTransition } from "$lib/ui/navigators/animations";
  import { currentCourse } from "$lib/runes.svelte";
  import { setShowHide } from "@tutors/tutors-model-lib";

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
  <div transition:scale|local={scaleTransition} class="bg-surface-100 dark:bg-surface-900 mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
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
