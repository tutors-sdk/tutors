<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
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

  export let data: any;

  const storeTab: Writable<string> = writable("Labs");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet = 0;
  let selectedLabChart: string = "LabView"; // Set default lab chart
  let selectedTopicChart: string = "TopicView"; // Set default topic chart
  let selectedInstructorLabChart: string = "InstructorLabView"; // Set default instructor lab chart
  let selectedInstructorTopicChart: string = "InstructorTopicView"; // Set default instructor topic chart

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

  // Event handler for dropdown change
  function handleLabChartChange(event: Event) {
    selectedLabChart = (event.target as HTMLSelectElement).value;
  }

  // Event handler for dropdown change
  function handleTopicChartChange(event: Event) {
    selectedTopicChart = (event.target as HTMLSelectElement).value;
  }

  // Event handler for dropdown change
  function handleInstructorLabChartChange(event: Event) {
    selectedInstructorLabChart = (event.target as HTMLSelectElement).value;
  }

  // Event handler for dropdown change
  function handleInstructorTopicChartChange(event: Event) {
    selectedInstructorTopicChart = (event.target as HTMLSelectElement).value;
  }
</script>

<div in:fade={{ duration: 500 }} class="bg-base-200 mt-3">
  <TabGroup selected={storeTab}>
    <Tab bind:group={tabSet} name="Calendar" value={0}>Calendar</Tab>
    <Tab bind:group={tabSet} name="Topics" value={1}>
      {instructorMode ? "Topics (Tutors View)" : "Topics"}
    </Tab>
    <Tab bind:group={tabSet} name="Labs" value={2}>
      {instructorMode ? "Labs (Tutors View)" : "Labs"}
    </Tab>
    <!-- {#if instructorMode}
      <Tab bind:group={tabSet} name="LiveStudents" value={3}>Live Students</Tab>
    {/if} -->
  </TabGroup>

  {#if tabSet === 0}
    {#if instructorMode}
      <NewInstructorCalendarTime course={data.course} timeActiveMap={data.timeActiveMap} userIds={data.calendarIds} />
    {:else}
      <CalendarView course={data.course} timeActiveMap={data.timeActiveMap} session={data.session} />
    {/if}
  {:else if tabSet === 1}
    {#if instructorMode}
      <!-- Dropdown for selecting topic charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleInstructorTopicChartChange} bind:value={selectedInstructorTopicChart}>
        <option value="InstructorTopicView">Instructor Topic Time Heat-Map</option>
        <option value="InstructorTopicViewPieChart">Instructor Topic Time Pie-Chart</option>
        <option value="InstructorTopicViewBoxPlot">Instructor Topic Box Plot Chart</option>
      </select>
      <!-- Display selected topic chart -->
      {#if selectedInstructorTopicChart === "Instructor"}
        <InstructorTopicView course={data.course} session={data.session} userIds={data.userIds} />
      {:else if selectedInstructorTopicChart === "InstructorTopicViewPieChart"}
        <InstructorTopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
      {:else if selectedInstructorTopicChart === "InstructorTopicViewBoxPlot"}
        <InstructorTopicViewBoxPlot course={data.course} userIds={data.userIds} />
      {/if}
    {:else}
      <!-- Dropdown for selecting topic charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleTopicChartChange} bind:value={selectedTopicChart}>
        <option value="TopicView">Topic Time Heat-Map</option>
        <option value="TopicViewPieChart">Topic Time Pie-Chart</option>
      </select>
      <!-- Display selected topic chart -->
      {#if selectedTopicChart === "TopicView"}
        <TopicView course={data.course} session={data.session} userIds={data.userIds} />
      {:else if selectedTopicChart === "TopicViewPieChart"}
        <TopicViewPieChart course={data.course} session={data.session} userIds={data.userIds} />
      {/if}
    {/if}
  {:else if tabSet === 2}
    {#if instructorMode}
      <!-- Dropdown for selecting lab charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleInstructorLabChartChange} bind:value={selectedInstructorLabChart}>
        <option value="NewInstructorLabTime">Instructor Lab Time Heat-Map</option>
        <option value="BoxPlotInstructorChart">Instructor Lab Time Box Plot Chart</option>
      </select>
      <!-- Display selected lab chart -->
      {#if selectedInstructorLabChart === "InstructorLabView"}
        <InstructorLabView course={data.course} session={data.session} userIds={data.userIds} />
      {:else if selectedInstructorLabChart === "InstructorLabViewBoxPlot"}
        <InstructorLabViewBoxPlot course={data.course} userIds={data.userIds} />
      {/if}
    {:else}
      <!-- Dropdown for selecting lab charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleLabChartChange} bind:value={selectedLabChart}>
        <option value="NewLabTime">Lab Time Heat-Map</option>
        <option value="LabTimeNewChart">Lab Time Bar/Pie-Chart</option>
      </select>
      <!-- Display selected lab chart -->
      {#if selectedLabChart === "LabView"}
        <LabView course={data.course} session={data.session} userIds={data.userIds} />
        <!-- <NewInstructorLabTime course={data.course} session={data.session} userIds={data.userIds} />   -->

        <!-- {:else if selectedLabChart === "LabTimeNewChart"}
        <LabTimeNewChart user={data.user} allLabs={data.allLabs} /> -->
      {/if}
    {/if}
    <!-- {:else if tabSet === 3}
    <LiveStudentFeed userMap={data.users} courseName={data.course.courseId} /> -->
  {/if}
</div>
