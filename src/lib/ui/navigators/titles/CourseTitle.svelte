<script lang="ts">
  import { currentCourse, currentLo } from "$lib/runes";
  import Image from "../../themes/Image.svelte";
  import { getIcon } from "../../themes/styles/icon-lib.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  // let lo: Lo;
  let wall = false;
</script>

{#if currentLo?.value}
  <div class="flex-1">
    <div class="inline-flex">
      {#if !wall}
        <Image lo={currentLo?.value} miniImage={true} />
      {:else}
        <Icon icon={getIcon(currentLo?.value.type).type} class="text-{getIcon(currentLo?.value.type).color}" width="40" height="40" />
      {/if}
    </div>
  </div>
  <div class="ml-4 flex-nowrap">
    <div class="flex">
      <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">{currentLo?.value?.title}</h2>
    </div>
    <!-- Badge -->
    <div class="hidden md:block" target="_blank">
      {#if currentLo?.value?.title != currentCourse?.value?.title}
        <p class="text-sm font-bold">{currentCourse?.value?.title}</p>
      {:else}
        <p class="text-sm font-bold">{currentCourse?.value?.properties?.credits}</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="ml-4 flex-nowrap">
    <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">Tutors</h2>
  </div>
{/if}
