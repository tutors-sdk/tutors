<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import CourseTitle from "./titles/CourseTitle.svelte";
  import SearchButton from "./buttons/SearchButton.svelte";
  import { currentCourse } from "$lib/runes";
  import LayoutMenu from "../themes/menu/LayoutMenu.svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import TutorsTimeIndicator from "./buttons/TutorsTimeIndicator.svelte";
  import TocButton from "./buttons/TocButton.svelte";
  import InfoButton from "./buttons/InfoButton.svelte";
  import AnonProfile from "./tutors-connect/AnonProfile.svelte";
  import ConnectedProfile from "./tutors-connect/ConnectedProfile.svelte";
</script>

<AppBar
  shadow="none"
  classes="bg-surface-100 dark:bg-surface-950 h-20"
  toolbarClasses="flex items-center"
  leadClasses="flex items-center"
  trailClasses="flex items-center"
>
  {#snippet lead()}
    <InfoButton />
    <CourseTitle />
  {/snippet}
  <!-- <CalendarButton /> -->
  {#snippet trail()}
    <TutorsTimeIndicator />
    {#if !currentCourse?.value?.isPortfolio}
      <SearchButton />
    {/if}
    <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
    <LayoutMenu />
    <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
    {#if !currentCourse?.value?.isPrivate}
      <div class="relative">
        {#if !tutorsConnectService.tutorsId.value?.login}
          <AnonProfile redirect="/{currentCourse?.value?.courseId}" />
        {:else}
          <ConnectedProfile />
        {/if}
      </div>
    {/if}
    {#if !currentCourse?.value?.isPortfolio}
      <TocButton />
    {/if}
  {/snippet}
</AppBar>
