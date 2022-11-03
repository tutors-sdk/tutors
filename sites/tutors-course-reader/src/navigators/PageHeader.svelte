<script lang="ts">
  import { currentCourse, portfolio } from "tutors-reader-lib/src/stores/stores";
  import { Breadcrumbs, IconBar } from "tutors-ui";
</script>

{#if $currentCourse}
  {#if !$currentCourse.isPortfolio() && !$portfolio}
    <div class="z-10 flex h-12 bg-primary-100 dark:bg-primary-900">
      <Breadcrumbs />
      <div class="flex flex-auto" />
      <div class="my-2 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none">
        <IconBar nav={$currentCourse.companions} />
      </div>
      <div class="my-2 ml-2 mr-10 hidden rounded-lg bg-primary-200 bg-opacity-80 dark:bg-primary-800 lg:flex lg:flex-none">
        <IconBar nav={$currentCourse.wallBar} />
      </div>
    </div>
  {/if}
{/if}
