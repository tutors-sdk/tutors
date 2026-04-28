<script lang="ts">
  import { onMount } from "svelte";

  import type { Lo } from "@tutors/tutors-model-lib";

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
  <div transition:scale|local={scaleTransition} class="mb-2 w-full">
    <ul class="flex flex-wrap items-stretch justify-start gap-2">
      {#key refresh}
        {#each los as lo}
          {#if !lo.hide}
            <li class="flex">
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
            </li>
          {/if}
        {/each}
      {/key}
    </ul>
  </div>
{/if}
