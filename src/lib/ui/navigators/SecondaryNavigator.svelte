<script lang="ts">
  import { fly } from "svelte/transition";
  import Breadcrumbs from "./buttons/Breadcrumbs.svelte";
  import EditCoursButton from "./buttons/EditCoursButton.svelte";
  import { slideFromLeft } from "../themes/animations";
  import IconBar from "../components/IconBar.svelte";
  import { themeService } from "$lib/services/themes.svelte";
  import { courseService } from "$lib/services/course.svelte";

  const themeClasses = $derived({
    firstDiv: themeService.currentTheme.value === "classic" ? "dark:bg-tertiary-900" : "dark:bg-primary-900",
    otherDiv: "dark:bg-primary-800"
  });
</script>

{#if !courseService.currentCourse?.value?.isPortfolio}
  <div in:fly={slideFromLeft.in} out:fly={slideFromLeft.out}>
    <div
      class="border-primary-100 bg-primary-50 dark:border-primary-800 {themeClasses.firstDiv} z-10 flex h-12 border-b-[1px]"
    >
      <Breadcrumbs />
      {#if courseService.currentCourse?.value}
        <div class="flex flex-auto"></div>
        {#if courseService.currentCourse?.value?.properties.github}
          <div
            class="bg-primary-200 {themeClasses.otherDiv} my-2 mr-2 hidden rounded-lg bg-opacity-80 lg:flex lg:flex-none"
          >
            <EditCoursButton />
          </div>
        {/if}
        <div class="bg-primary-200 {themeClasses.otherDiv} my-2 hidden rounded-lg bg-opacity-80 lg:flex lg:flex-none">
          <IconBar nav={courseService.currentCourse?.value?.companions} />
        </div>
        <div
          class="bg-primary-200 {themeClasses.otherDiv} my-2 ml-2 mr-10 flex hidden rounded-lg bg-opacity-80 sm:flex lg:flex"
        >
          <IconBar nav={courseService.currentCourse?.value?.wallBar} />
        </div>
      {/if}
    </div>
  </div>
{/if}
