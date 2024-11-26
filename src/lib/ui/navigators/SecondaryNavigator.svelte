<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import { fly } from "svelte/transition";
  import Breadcrumbs from "../themes/icons/Breadcrumbs.svelte";
  import EditCoursButton from "./buttons/EditCoursButton.svelte";
  import IconBar from "../themes/icons/IconBar.svelte";
</script>

{#if !currentCourse?.value?.isPortfolio}
  <div in:fly={{ x: -200, duration: 300, delay: 300 }} out:fly={{ x: -200, duration: 300 }}>
    <div
      class="border-primary-100 bg-primary-50 dark:border-primary-800 dark:bg-primary-900 z-10 flex h-12 border-b-[1px]"
    >
      <Breadcrumbs />
      {#if currentCourse?.value}
        <div class="flex flex-auto"></div>
        {#if currentCourse?.value?.properties.github}
          <div
            class="bg-primary-200 dark:bg-primary-800 my-2 mr-2 hidden rounded-lg bg-opacity-80 lg:flex lg:flex-none"
          >
            <EditCoursButton />
          </div>
        {/if}
        <div class="bg-primary-200 dark:bg-primary-800 my-2 hidden rounded-lg bg-opacity-80 lg:flex lg:flex-none">
          <IconBar nav={currentCourse?.value?.companions} />
        </div>
        <div
          class="bg-primary-200 dark:bg-primary-800 my-2 ml-2 mr-10 flex hidden rounded-lg bg-opacity-80 sm:flex lg:flex"
        >
          <IconBar nav={currentCourse?.value?.wallBar} />
        </div>
      {/if}
    </div>
  </div>
{/if}
