<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton";
  import InfoButton from "./buttons/InfoButton.svelte";
  import CourseTitle from "./titles/CourseTitle.svelte";
  import SearchButton from "./buttons/SearchButton.svelte";
  import CalendarButton from "./buttons/CalendarButton.svelte";
  import TocButton from "./buttons/TocButton.svelte";
  import { currentCourse } from "$lib/runes";
  import LayoutMenu from "../themes/menu/LayoutMenu.svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import AnonProfile from "./tutors-connect/AnonProfile.svelte";
  import ConnectedProfile from "./tutors-connect/ConnectedProfile.svelte";
  import TutorsTimeIndicator from "./buttons/TutorsTimeIndicator.svelte";
</script>

<AppBar background="bg-surface-100-800-token" shadow="none" class="h-20 justify-center border-b-[1px] border-surface-200 dark:border-surface-700">
  {#snippet lead()}
    <InfoButton />
    <CourseTitle />
  {/snippet}
  <CalendarButton />
  {#snippet trail()}
    <TutorsTimeIndicator />
    {#if !currentCourse?.value?.isPortfolio}
      <SearchButton />
    {/if}
    <span class="divider-vertical hidden h-10 lg:block"></span>
    <LayoutMenu />
    <span class="divider-vertical hidden h-10 lg:block"></span>
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
