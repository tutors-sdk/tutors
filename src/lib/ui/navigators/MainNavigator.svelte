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
  import TutorsTitle from "./titles/TutorsTitle.svelte";
</script>

<AppBar
  padding="p-2"
  spaceY=""
  toolbarClasses="flex items-center"
  leadClasses="flex items-center"
  trailClasses="flex items-center"
>
  {#snippet lead()}
    {#if currentCourse?.value}
      <InfoButton />
      <CourseTitle />
    {:else}
      <span class="ml-12">
        <TutorsTitle title="Tutors Open Source Project" subtitle="Open Web Learning Components" />
      </span>
    {/if}
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
    {#if currentCourse?.value && !currentCourse?.value?.isPortfolio}
      <TocButton />
    {/if}
  {/snippet}
</AppBar>
