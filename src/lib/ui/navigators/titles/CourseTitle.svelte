<script lang="ts">
  import { currentCourse, currentLo } from "$lib/runes";
  import Image from "../../themes/Image.svelte";
</script>

{#if currentLo?.value}
  <div class="flex-1">
    <div class="inline-flex">
      <Image lo={currentLo?.value} miniImage={true} />
    </div>
  </div>
  <div class="ml-4 flex-nowrap">
    <div class="flex">
      <h2 class="mr-4 hidden !text-sm font-bold sm:!text-lg md:inline-block">{currentLo?.value?.title}</h2>
    </div>
    <div class="hidden md:block">
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
