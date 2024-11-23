<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  // import InfoButton from "./buttons/InfoButton.svelte";
  import CourseTitle from "./titles/CourseTitle.svelte";
  import SearchButton from "./buttons/SearchButton.svelte";
  // import CalendarButton from "./buttons/CalendarButton.svelte";

  import { currentCourse } from "$lib/runes";
  import LayoutMenu from "../themes/menu/LayoutMenu.svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  // import AnonProfile from "./tutors-connect/AnonProfile.svelte";
  // import ConnectedProfile from "./tutors-connect/ConnectedProfile.svelte";
  import TutorsTimeIndicator from "./buttons/TutorsTimeIndicator.svelte";
  import TocButton from "./buttons/TocButton.svelte";
</script>

<AppBar shadow="none" classes="bg-surface-100 dark:bg-surface-950 h-20 justify-center">
  {#snippet lead()}
    <!-- <InfoButton /> -->
    <CourseTitle />
  {/snippet}
  <!-- <CalendarButton /> -->
  {#snippet trail()}
    <TutorsTimeIndicator />
    {#if !currentCourse?.value?.isPortfolio}
      <SearchButton />
    {/if}
    <span class="divider-vertical hidden h-10 lg:block"></span>
    <LayoutMenu />
    <span class="divider-vertical hidden h-10 lg:block"></span>
    {#if !currentCourse?.value?.isPrivate}
      <!-- <div class="relative">
        {#if !tutorsConnectService.tutorsId.value?.login}
          <AnonProfile redirect="/{currentCourse?.value?.courseId}" />
        {:else}
          <ConnectedProfile />
        {/if}
      </div> -->
    {/if}
    {#if !currentCourse?.value?.isPortfolio}
      <TocButton />
    {/if}
  {/snippet}
</AppBar>
