<script lang="ts">
  import { currentCourse, currentLo } from "$lib/runes.svelte";
  import Image from "../../components/Image.svelte";
</script>

{#if currentLo?.value}
  <div class="flex flex-nowrap items-center">
    <div class="mr-2 inline-flex">
      {#if currentLo?.value?.img}
        <Image lo={currentLo?.value} miniImage={true} />
      {:else}
        <Image lo={currentCourse?.value} miniImage={true} />
      {/if}
    </div>
    <div>
      <h2 class="mr-4 text-sm! font-bold sm:text-lg! md:inline-block">
        {currentLo?.value?.title}
      </h2>
      <div class="hidden md:block">
        {#if currentLo?.value?.title != currentCourse?.value?.title}
          <p class="text-sm font-bold">{currentCourse?.value?.title}</p>
        {:else}
          <p class="text-sm font-bold">{currentCourse?.value?.properties?.credits}</p>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="ml-4 flex flex-nowrap items-center">
    <h2 class="mr-4 text-sm! font-bold sm:text-lg! md:inline-block">Tutors</h2>
  </div>
{/if}
