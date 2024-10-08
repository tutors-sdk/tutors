<script lang="ts">
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import LabView from "$lib/ui/time/supabase/views/LabView.svelte";
  import InstructorLabView from "$lib/ui/time/supabase/views/InstructorLabView.svelte";
  import NewInstructorCalendarTime from "$lib/ui/time/supabase/views/InstructorCalendarView.svelte";
  import CalendarView from "$lib/ui/time/supabase/views/CalendarView.svelte";
  import TopicView from "$lib/ui/time/supabase/views/TopicView.svelte";
  import InstructorTopicView from "$lib/ui/time/supabase/views/InstructorTopicView.svelte";
  import TopicViewPieChart from "$lib/ui/time/supabase/views/TopicViewPieChart.svelte";
  import InstructorTopicViewPieChart from "$lib/ui/time/supabase/views/InstructorTopicViewPieChart.svelte";
  import InstructorLabViewBoxPlot from "$lib/ui/time/supabase/views/InstructorLabViewBoxPlot.svelte";
  import InstructorTopicViewBoxPlot from "$lib/ui/time/supabase/views/InstructorTopicViewBoxPlot.svelte";
  import LabViewPieChart from "$lib/ui/time/supabase/views/LabViewPieChart.svelte";

  export let data: any;

  // Store for main and sub-tabs
  const storeTab: Writable<string> = writable("Calendar");
  let pinBuffer = "";
  let instructorMode = false;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
  });

  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.course.ignorePin) {
      instructorMode = true;
      handleTabChange("Calendar");
    }
  }

  // Handle main tab change
  function handleTabChange(tab: string) {
    storeTab.set(tab);
  }
</script>

<div class="flex">
  <!-- Side Tabs (Sticky) -->
  <div class="flex flex-col w-1/8 border-r border-gray-300 sticky top-0 h-screen overflow-auto">
    <!-- Main Tabs -->
    <button type="button" class="p-4 text-left" class:active={$storeTab === "Calendar"} on:click={() => handleTabChange("Calendar")}>Calendar</button>

    {#if instructorMode}
      <button type="button" class="p-4 text-left" class:active={$storeTab === "Topics"} on:click={() => handleTabChange("InstructorTopicView")}>Topics</button>

      <!-- Always Show Sub-tabs for Topics -->

      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "InstructorTopicView"} on:click={() => handleTabChange("InstructorTopicView")}
        >Topic Heat-Map</button
      >
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "InstructorTopicViewPieChart"} on:click={() => handleTabChange("InstructorTopicViewPieChart")}
        >Topic Pie-Chart</button
      >
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "InstructorTopicViewBoxPlot"} on:click={() => handleTabChange("InstructorTopicViewBoxPlot")}
        >Topic Box-Plot</button
      >
    {:else}
      <button type="button" class="p-4 text-left" class:active={$storeTab === "Topics"} on:click={() => handleTabChange("TopicView")}>Topics</button>
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "TopicView"} on:click={() => handleTabChange("TopicView")}>Topic Heat-Map</button>
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "TopicViewPieChart"} on:click={() => handleTabChange("TopicViewPieChart")}
        >Topic Pie-Chart</button
      >
    {/if}
    {#if instructorMode}
      <button type="button" class="p-4 text-left" class:active={$storeTab === "Labs"} on:click={() => handleTabChange("InstructorLabView")}>Labs</button>

      <!-- Always Show Sub-tabs for Labs -->
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "InstructorLabView"} on:click={() => handleTabChange("InstructorLabView")}>Lab Heat-Map</button>
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "InstructorLabViewBoxPlot"} on:click={() => handleTabChange("InstructorLabViewBoxPlot")}
        >Lab Box-Plot</button
      >
    {:else}
      <button type="button" class="p-4 text-left" class:active={$storeTab === "Labs"} on:click={() => handleTabChange("LabView")}>Labs</button>
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "LabView"} on:click={() => handleTabChange("LabView")}>Lab Heat-Map</button>
      <button type="button" class="ml-8 p-2 text-left" class:active={$storeTab === "LabViewPieChart"} on:click={() => handleTabChange("LabViewPieChart")}>Lab Pie-Chart</button>
    {/if}
  </div>

  <!-- Main Content Area -->
  <div class="flex-grow p-4 w-5/6">
    {#if $storeTab === "Calendar"}
      {#if instructorMode}
        <NewInstructorCalendarTime timeActiveMap={data.timeActiveMap} userIds={data.calendarIds} userNamesAvatars={data.userNamesAvatars} />
      {:else}
        <CalendarView timeActiveMap={data.timeActiveMap} session={data.session} medianTime={data.medianTime} />
      {/if}
    {/if}
    {#if instructorMode}
      {#if $storeTab === "InstructorTopicView"}
        <InstructorTopicView course={data.course} session={data.session} userIds={data.userIds} userNamesAvatars={data.userNamesAvatars} />
      {:else if $storeTab === "InstructorTopicViewPieChart"}
        <InstructorTopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
      {:else if $storeTab === "InstructorTopicViewBoxPlot"}
        <InstructorTopicViewBoxPlot course={data.course} userIds={data.userIds} userNamesAvatars={data.userNamesAvatars} />
      {:else if $storeTab === "InstructorLabView"}
        <InstructorLabView course={data.course} session={data.session} userIds={data.userIds} userNamesAvatars={data.userNamesAvatars} />
      {:else if $storeTab === "InstructorLabViewBoxPlot"}
        <InstructorLabViewBoxPlot course={data.course} userIds={data.userIds} userNamesAvatars={data.userNamesAvatars} />
      {/if}
    {:else if $storeTab === "TopicView"}
      <TopicView course={data.course} session={data.session} userIds={data.userIds} />
    {:else if $storeTab === "TopicViewPieChart"}
      <TopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
    {:else if $storeTab === "LabView"}
      <LabView course={data.course} session={data.session} userIds={data.userIds} />
    {:else if $storeTab === "LabViewPieChart"}
      <LabViewPieChart course={data.course} session={data.session} />
    {/if}
  </div>
</div>

<style>
  .active {
    @apply bg-gray-200 font-bold;
  }

  /* Sticky Sidebar */
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
</style>
