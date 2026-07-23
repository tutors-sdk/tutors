<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import type { Lo } from "@tutors/tutors-model-lib";

  import Card from "$lib/ui/learning-objects/layout/Card.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { scale } from "svelte/transition";
  import { scaleTransition } from "$lib/ui/navigators/animations";
  import { currentCourse, isLecturer, contentLocks, tutorsId } from "$lib/runes.svelte";
  import { setShowHide } from "@tutors/tutors-model-lib";
  import { rbacService } from "$lib/services/rbac";

  interface Props {
    los?: Lo[];
  }
  let { los = [] }: Props = $props();

  let pinBuffer = "";
  let ignorePin = "";
  let refresh = $state(true);
  let isLoaded = $state(false);
  let hasKeyListener = false;

  function keypressInput(e: KeyboardEvent) {
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
      hasKeyListener = true;
    }
    isLoaded = true;
  });

  onDestroy(() => {
    if (hasKeyListener) {
      window.removeEventListener("keydown", keypressInput);
    }
  });
</script>

{#if los.length > 0 && isLoaded}
  <div transition:scale|local={scaleTransition} class="bg-surface-100 dark:bg-surface-900 mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="mx-auto flex flex-wrap justify-center">
      {#key refresh}
        {#each los as lo}
          {#if !lo.hide}
            <div class="relative flex justify-center">
              {#if contentLocks.value.get(lo.route) && !isLecturer.value}
                <div class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-surface-500/30 backdrop-blur-[2px]">
                  <Icon type="lock" height="48" />
                </div>
              {/if}
              <Card
                cardDetails={{
                  route: contentLocks.value.get(lo.route) && !isLecturer.value ? "#" : lo.route,
                  title: lo.title,
                  type: lo.type,
                  summary: lo.summary,
                  img: lo.img,
                  icon: lo.icon,
                  video: lo.video
                }}
              />
              {#if isLecturer.value}
                <button
                  class="absolute top-2 right-2 z-20 rounded-lg bg-surface-200 p-1 opacity-70 transition-opacity hover:opacity-100 dark:bg-surface-700"
                  onclick={() => rbacService.toggleLock(currentCourse.value!.courseId, lo.route, tutorsId.value!.login)}
                >
                  <Icon type={contentLocks.value.get(lo.route) ? "lock" : "unlock"} height="20" />
                </button>
              {/if}
            </div>
          {/if}
        {/each}
      {/key}
    </div>
  </div>
{/if}
