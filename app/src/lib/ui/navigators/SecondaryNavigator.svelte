<script lang="ts">
  import { currentCourse } from "$lib/stores";
  import { fly } from "svelte/transition";
  import Breadcrumbs from "../icons/Breadcrumbs.svelte";
  import IconBar from "../icons/IconBar.svelte";
</script>

{#if !$currentCourse?.isPortfolio}
  <div in:fly={{ x: -200, duration: 300, delay: 300 }} out:fly={{ x: -200, duration: 300 }}>
    <div class="z-10 flex h-12 bg-primary-50 dark:bg-primary-900 border-b-[1px] border-primary-100 dark:border-primary-800">
      <Breadcrumbs />
      {#if $currentCourse}
        <div class="flex flex-auto" />
        <div class="my-2 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none">
          <IconBar nav={$currentCourse?.companions} />
        </div>
        <div class="my-2 ml-2 mr-10 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none">
          <IconBar nav={$currentCourse?.wallBar} />
        </div>
      {/if}
    </div>
  </div>
{/if}
