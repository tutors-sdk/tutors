<script lang="ts">
  import { currentCourse, portfolio } from "../../stores";
  import Breadcrumbs from "./support/Breadcrumbs.svelte";
  import IconBar from "tutors-reader-lib/src/iconography/IconBar.svelte";
</script>

{#if $currentCourse}
<div class="bg-primary-100 dark:bg-primary-900 flex">
    {#if !$currentCourse.isPortfolio() && !$portfolio}
      <Breadcrumbs />
      <div class="flex flex-auto"></div>
      <div class="hidden lg:flex lg:flex-none lg:bg-primary-200 dark:bg-primary-800 lg:rounded-lg lg:my-4">
        <IconBar nav={$currentCourse.companions} />
      </div>
      <div class="hidden lg:flex lg:flex-none lg:bg-primary-200 dark:bg-primary-800 lg:rounded-lg lg:my-4 lg:ml-2 mr-10">
        <IconBar nav={$currentCourse.wallBar} />
      </div>
    {/if}
  </div>
{/if}