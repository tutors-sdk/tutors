<script lang="ts">
  import Breadcrumbs from "./buttons/Breadcrumbs.svelte";
  import EditCoursButton from "./buttons/EditCoursButton.svelte";
  import IconBar from "../components/IconBar.svelte";
  import { currentCourse, currentLo } from "$lib/runes.svelte";
  import { themeService } from "$lib/services/themes/services/themes.svelte";
  import AIChatButton from "./buttons/AIChatButton.svelte";

  let { lo, parentCourse = null } = $props();
  const themeClasses = $derived({
    firstDiv: themeService.currentTheme.value === "classic" ? "dark:bg-tertiary-900" : "dark:bg-primary-900",
    otherDiv: "dark:bg-primary-800"
  });
</script>

<div class="border-primary-100 bg-primary-50 dark:border-primary-800 z-5 mb-2 {themeClasses.firstDiv} sticky top-0 flex h-12 border-b-[1px]">
  <Breadcrumbs {lo} {parentCourse} />
  {#if currentCourse?.value}
    <div class="flex flex-auto"></div>
    {#if currentLo?.value?.type == "lab"}
      <div class="bg-primary-200 {themeClasses.otherDiv} bg-opacity-80 my-2 mr-2 hidden rounded-lg lg:flex">
        <AIChatButton />
      </div>
    {/if}
    {#if currentCourse?.value?.properties.github}
      <div class="bg-primary-200 {themeClasses.otherDiv} bg-opacity-80 my-2 mr-2 hidden rounded-lg lg:flex lg:flex-none">
        <EditCoursButton />
      </div>
    {/if}
    <div class="bg-primary-200 {themeClasses.otherDiv} bg-opacity-80 my-2 hidden rounded-lg lg:flex lg:flex-none">
      <IconBar nav={currentCourse?.value?.companions} />
    </div>
    <div class="bg-primary-200 {themeClasses.otherDiv} bg-opacity-80 my-2 mr-10 ml-2 flex hidden rounded-lg sm:flex lg:flex">
      <IconBar nav={currentCourse?.value?.wallBar} />
    </div>
  {/if}
</div>
