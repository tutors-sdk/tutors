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

  const storeTab: Writable<string> = writable("Calendar");
  const storeSubTab: Writable<string> = writable("");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet = 0;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
    if (!data?.course.hasCalendar) {
      tabSet = 0;
    }
  });

  // Event handling function
  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.course.ignorePin) {
      instructorMode = true;
      tabSet = 0;
      if (!data?.course.hasCalendar) {
        tabSet = 1;
      }
    }
  }

  function handleTabChange(tab: string) {
    storeTab.set(tab);
    // Reset sub-tab based on the selected main tab
    if (tab === "Topics") {
      storeSubTab.set(instructorMode ? "InstructorTopicView" : "TopicView");
    } else if (tab === "Labs") {
      storeSubTab.set(instructorMode ? "InstructorLabView" : "LabView");
    } else {
      storeSubTab.set("");
    }
  }

  function handleSubTabChange(subTab: string) {
    storeSubTab.set(subTab);
  }
</script>

<div class="flex">
  <!-- Side Tabs -->
  <div class="flex flex-col w-1/6 border-r border-gray-300">
    <button
      type="button"
      class="p-4 text-left"
      class:active={$storeTab === "Calendar"}
      on:click={() => handleTabChange("Calendar")}
      on:keydown={(e) => e.key === "Enter" && handleTabChange("Calendar")}>Calendar</button
    >
    <button
      type="button"
      class="p-4 text-left"
      class:active={$storeTab === "Topics"}
      on:click={() => handleTabChange("Topics")}
      on:keydown={(e) => e.key === "Enter" && handleTabChange("Topics")}>Topics</button
    >
    <button
      type="button"
      class="p-4 text-left"
      class:active={$storeTab === "Labs"}
      on:click={() => handleTabChange("Labs")}
      on:keydown={(e) => e.key === "Enter" && handleTabChange("Labs")}>Labs</button
    >
  </div>
  <!-- Content Area -->
  <div class="flex-grow p-4 w-4/5">
    <!-- Top Tabs for Sub-items -->
    <div class="flex border-b border-gray-300 mb-4">
      {#if $storeTab === "Topics"}
        {#if instructorMode}
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "InstructorTopicView"}
            on:click={() => handleSubTabChange("InstructorTopicView")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("InstructorTopicView")}>Instructor Topic Time Heat-Map</button
          >
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "InstructorTopicViewPieChart"}
            on:click={() => handleSubTabChange("InstructorTopicViewPieChart")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("InstructorTopicViewPieChart")}>Instructor Topic Time Pie-Chart</button
          >
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "InstructorTopicViewBoxPlot"}
            on:click={() => handleSubTabChange("InstructorTopicViewBoxPlot")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("InstructorTopicViewBoxPlot")}>Instructor Topic Box Plot Chart</button
          >
        {:else}
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "TopicView"}
            on:click={() => handleSubTabChange("TopicView")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("TopicView")}>Topic Time Heat-Map</button
          >
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "TopicViewPieChart"}
            on:click={() => handleSubTabChange("TopicViewPieChart")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("TopicViewPieChart")}>Topic Time Pie-Chart</button
          >
        {/if}
      {/if}
      {#if $storeTab === "Labs"}
        {#if instructorMode}
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "InstructorLabView"}
            on:click={() => handleSubTabChange("InstructorLabView")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("InstructorLabView")}>Instructor Lab Time Heat-Map</button
          >
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "InstructorLabViewBoxPlot"}
            on:click={() => handleSubTabChange("InstructorLabViewBoxPlot")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("InstructorLabViewBoxPlot")}>Instructor Lab Time Box Plot Chart</button
          >
        {:else}
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "LabView"}
            on:click={() => handleSubTabChange("LabView")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("LabView")}>Lab Time Heat-Map</button
          >
          <button
            type="button"
            class="p-2 text-left"
            class:active={$storeSubTab === "LabViewPieChart"}
            on:click={() => handleSubTabChange("LabViewPieChart")}
            on:keydown={(e) => e.key === "Enter" && handleSubTabChange("LabViewPieChart")}>Lab Time Pie-Chart</button
          >
        {/if}
      {/if}
    </div>
    <!-- Main Content -->
    <div class="w-full">
      {#if $storeTab === "Calendar"}
        {#if instructorMode}
          <NewInstructorCalendarTime
            timeActiveMap={data.timeActiveMap}
            userIds={data.calendarIds}
            userNamesUseridsMap={data.userNamesUseridsMap}
            userAvatarsUseridsMap={data.userAvatarsUseridsMap}
          />
        {:else}
          <CalendarView timeActiveMap={data.timeActiveMap} session={data.session} medianTime={data.medianTime} />
        {/if}
      {:else if $storeTab === "Topics"}
        {#if instructorMode}
          {#if $storeSubTab === "InstructorTopicView"}
            <InstructorTopicView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {:else if $storeSubTab === "InstructorTopicViewPieChart"}
            <InstructorTopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
          {:else if $storeSubTab === "InstructorTopicViewBoxPlot"}
            <InstructorTopicViewBoxPlot course={data.course} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {:else}
            <InstructorTopicView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {/if}
        {:else if $storeSubTab === "TopicView"}
          <TopicView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
        {:else if $storeSubTab === "TopicViewPieChart"}
          <TopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
        {:else}
          <TopicView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
        {/if}
      {:else if $storeTab === "Labs"}
        {#if instructorMode}
          {#if $storeSubTab === "InstructorLabView"}
            <InstructorLabView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {:else if $storeSubTab === "InstructorLabViewBoxPlot"}
            <InstructorLabViewBoxPlot course={data.course} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {:else}
            <InstructorLabView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
          {/if}
        {:else if $storeSubTab === "LabView"}
          <LabView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
        {:else if $storeSubTab === "LabViewPieChart"}
          <LabViewPieChart course={data.course} session={data.session} />
        {:else}
          <LabView course={data.course} session={data.session} userIds={data.userIds} userNamesUseridsMap={data.userNamesUseridsMap} />
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .active {
    @apply bg-gray-200 font-bold;
  }
</style>
