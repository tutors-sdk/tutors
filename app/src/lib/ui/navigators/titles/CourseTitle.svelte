<script lang="ts">
  import { currentCourse, currentLo } from "$lib/stores";
  import Image from "../../icons/Image.svelte";
  import type { Lo } from "$lib/services/models/lo-types";
  import { getIcon } from "../../icons/themes/themes";
  import { onDestroy } from "svelte";
  import Icon from "$lib/ui/icons/Icon.svelte";

  let lo: Lo;
  let wall = false;
  const unsubscribe = currentLo.subscribe((current) => {
    lo = current;
    if (lo && lo.type === "unit") {
      lo.img = lo.parentLo?.img;
      lo.icon = lo.parentLo?.icon;
    } else if (lo && lo.route.includes("wall")) {
      wall = true;
    }
  });
  onDestroy(unsubscribe);
</script>

{#if $currentLo}
  <div class="flex-1">
    <div class="inline-flex">
      {#if !wall}
        <Image {lo} miniImage={true} />
      {:else}
        <Icon icon={getIcon(lo.type).icon} class="text-{getIcon(lo.type).colour}" width="40" height="40" />
      {/if}
    </div>
  </div>
  <div class="ml-4 flex-nowrap">
    <div class="flex">
      <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">{$currentLo.title}</h2>
    </div>
    <!-- Badge -->
    <div class="hidden md:block" target="_blank">
      {#if $currentLo.title != $currentCourse?.title}
        <p class="text-sm font-bold">{$currentCourse?.title}</p>
      {:else}
        <p class="text-sm font-bold">{$currentCourse?.properties?.credits}</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="ml-4 flex-nowrap">
    <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">Tutors</h2>
  </div>
{/if}
