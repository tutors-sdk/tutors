<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import CourseTitle from "./titles/CourseTitle.svelte";
  import SearchButton from "./buttons/SearchButton.svelte";
  import LayoutMenu from "./LayoutMenu.svelte";
  import { tutorsConnectService } from "$lib/services/connect/services/connect.svelte";
  import TutorsTimeIndicator from "./buttons/TutorsTimeIndicator.svelte";
  import TocButton from "./buttons/TocButton.svelte";
  import InfoButton from "./buttons/InfoButton.svelte";
  import AnonProfile from "./tutors-connect/AnonProfile.svelte";
  import ConnectedProfile from "./tutors-connect/ConnectedProfile.svelte";
  import TutorsTitle from "./titles/TutorsTitle.svelte";
  import CalendarButton from "./buttons/CalendarButton.svelte";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
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
      <span class="hidden md:block">
        <InfoButton />
      </span>
      <CourseTitle />
    {:else}
      <span class="ml-12">
        <TutorsTitle title="Tutors Open Source Project" subtitle="Open Web Learning Components" />
      </span>
    {/if}
  {/snippet}
  <CalendarButton />
  {#snippet trail()}
    <span class="hidden md:block">
      <TutorsTimeIndicator />
      {#if currentCourse?.value && !currentCourse?.value?.isPortfolio}
        <SearchButton />
      {/if}
      <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
    </span>
    <LayoutMenu />
    <span class="mx-2 h-10 w-[1px] bg-gray-400 dark:bg-gray-200"></span>
    {#if !currentCourse?.value?.isPrivate}
      <div class="relative">
        {#if !tutorsId.value?.login}
          <AnonProfile redirect="/{currentCourse?.value?.courseId}" />
        {:else}
          <ConnectedProfile />
        {/if}
      </div>
    {/if}
    <span class="hidden md:block">
      {#if currentCourse?.value && !currentCourse?.value?.isPortfolio}
        <TocButton />
      {/if}
    </span>
  {/snippet}
</AppBar>
