<!-- <script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import TopicTimeNewChart from "$lib/ui/time/next-time/TopicTimeNewChart.svelte";
  import LabTimeNewChart from "$lib/ui/time/next-time/LabTimeNewChart.svelte";
  import CalendarTimeNewChart from "$lib/ui/time/next-time/CalendarTimeNewChart.svelte";
  import NewInstructorCalendarTime from "$lib/ui/time/next-time/NewInstructorCalendarTime.svelte";
  import NewInstructorLabTime from "$lib/ui/time/next-time/NewInstructorLabTime.svelte";
  import BoxPlotInstructorChart from "$lib/ui/time/next-time/BoxPlotInstructorChart.svelte";
  import NewLabTime from "$lib/ui/time/next-time/NewLabTime.svelte";
  import NewTopicTime from "$lib/ui/time/next-time/NewTopicTime.svelte";
  import NewInstructorTopicTime from "$lib/ui/time/next-time/NewInstructorTopicTime.svelte";
  import LiveStudentFeed from "$lib/ui/time/next-time/LiveStudentFeed.svelte";
  import InstructorTotalTopicTimePieChart from "$lib/ui/time/next-time/InstructorTotalTopicTimePieChart.svelte";
  import InstructorTopicBoxPlotChart from "$lib/ui/time/next-time/InstructorTopicBoxPlotChart.svelte";

  export let data: any;

  const storeTab: Writable<string> = writable("Labs");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet = 0;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
    if (!data.course?.hasCalendar) {
      tabSet = 1;
    }
  });

  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.ignorePin) {
      instructorMode = true;
      tabSet = 5;
      if (!data.course?.hasCalendar) {
        tabSet = 6;
      }
    }
  }
</script>

<div in:fade={{ duration: 500 }} class="bg-base-200 mt-3">
  <TabGroup selected={storeTab}>
    {#if !instructorMode}
      {#if data.course?.hasCalendar}
        <Tab bind:group={tabSet} name="calendar" value={0}>Calendar</Tab>
      {/if}
      <Tab bind:group={tabSet} name="labs" value={1}>Labs</Tab>
      <Tab bind:group={tabSet} name="labs-chart" value={2}>Labs (new chart)</Tab>
      <Tab bind:group={tabSet} name="topics" value={3}>Topics</Tab>
      <Tab bind:group={tabSet} name="topics-chart" value={4}>Topics (new chart)</Tab>
    {:else}
      {#if data.course?.hasCalendar}
        <Tab bind:group={tabSet} name="calendar-all" value={5}>Calendar (new chart)</Tab>
      {/if}
      {#if data.course?.hasEnrollment}
        <Tab bind:group={tabSet} name="LabsAllStudent" value={6}>Labs(enrolled)</Tab>
        <Tab bind:group={tabSet} name="topicsAllStudent" value={7}>Topics(enrolled)</Tab>
        <Tab bind:group={tabSet} name="total-topics-all-Students" value={8}>Aggregated Topics(enrolled)</Tab>
      {/if}
      <Tab bind:group={tabSet} name="allLabsBoxPlot" value={9}>Labs(Box Plot)</Tab>
      <Tab bind:group={tabSet} name="allTopicsBoxPlot" value={10}>Topics(Box Plot)</Tab>
      <Tab bind:group={tabSet} name="liveStudents" value={11}>Active (now)</Tab>
    {/if}
  </TabGroup>
  {#if tabSet === 0}
    {#if data.course?.hasCalendar}
      <CalendarTimeNewChart user={data.user} calendarData={data.calendar} />
    {/if}
  {:else if tabSet === 1}
    <NewLabTime user={data.user} allLabs={data.allLabs} />
  {:else if tabSet === 2}
    <LabTimeNewChart user={data.user} allLabs={data.allLabs} />
  {:else if tabSet === 3}
    <NewTopicTime user={data.user} topics={data.allTopics} />
  {:else if tabSet === 4}
    <TopicTimeNewChart user={data.user} topics={data.allTopics} />
  {:else if tabSet === 5}
    {#if data.course?.hasEnrollment}
      <NewInstructorCalendarTime userMap={data.enrolledUsers} calendarData={data.calendar} />
    {:else}
      <NewInstructorCalendarTime userMap={data.users} calendarData={data.calendar} />
    {/if}
  {:else if tabSet === 6}
    <NewInstructorLabTime userMap={data.users} allLabs={data.allLabs} />
  {:else if tabSet === 7}
    <NewInstructorTopicTime userMap={data.users} topics={data.allTopics} />
  {:else if tabSet === 8}
    <InstructorTotalTopicTimePieChart userMap={data.users} topics={data.allTopics} />
  {:else if tabSet === 9}
    <BoxPlotInstructorChart userMap={data.users} allLabs={data.allLabs} />
  {:else if tabSet === 10}
    <InstructorTopicBoxPlotChart userMap={data.users} topics={data.allTopics} />
  {:else if tabSet === 11}
    <LiveStudentFeed userMap={data.users} courseName={data.course.courseId} />
  {/if}
</div> -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import BoxPlotInstructorChart from "$lib/ui/time/supabase/BoxPlotInstructorChart.svelte";
  import CalendarTimeNewChart from "$lib/ui/time/supabase/CalendarTimeNewChart.svelte";
  import InstructorTopicBoxPlotChart from "$lib/ui/time/supabase/InstructorTopicBoxPlotChart.svelte";
  import InstructorTotalTopicTimePieChart from "$lib/ui/time/supabase/InstructorTotalTopicTimePieChart.svelte";
  import LabTimeNewChart from "$lib/ui/time/supabase/LabTimeNewChart.svelte";
  import LiveStudentFeed from "$lib/ui/time/supabase/LiveStudentFeed.svelte";
  import NewInstructorCalendarTime from "$lib/ui/time/supabase/NewInstructorCalendarTime.svelte";
  import NewInstructorLabTime from "$lib/ui/time/supabase/NewInstructorLabTime.svelte";
  import NewInstructorTopicTime from "$lib/ui/time/supabase/NewInstructorTopicTime.svelte";
  import NewLabTime from "$lib/ui/time/supabase/NewLabTime.svelte";
  import NewTopicTime from "$lib/ui/time/supabase/NewTopicTime.svelte";
  import TopicTimeNewChart from "$lib/ui/time/supabase/TopicTimeNewChart.svelte";

  export let data: any;

  const storeTab: Writable<string> = writable("Labs");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet = 0;
  let selectedLabChart: string = "NewLabTime"; // Set default lab chart
  let selectedTopicChart: string = "NewTopicTime"; // Set default topic chart
  let selectedInstructorLabChart: string = "NewInstructorLabTime"; // Set default instructor lab chart
  let selectedInstructorTopicChart: string = "NewInstructorTopicTime"; // Set default instructor topic chart

  // Initialize
  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
    if (!data.course?.hasCalendar) {
      tabSet = 0;
    }
  });

  // Event handling function
  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.ignorePin) {
      instructorMode = true;
      tabSet = 0;
      if (!data.course?.hasCalendar) {
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
    {#if instructorMode}
      <Tab bind:group={tabSet} name="LiveStudents" value={3}>Live Students</Tab>
    {/if}
  </TabGroup>

  {#if tabSet === 0}
    {#if instructorMode}
      <NewInstructorCalendarTime userMap={data.users} calendarData={data.calendar} />
    {:else}
      <CalendarTimeNewChart user={data.user} calendarData={data.calendar} />
    {/if}
  {:else if tabSet === 1}
    {#if instructorMode}
      <!-- Dropdown for selecting topic charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleInstructorTopicChartChange} bind:value={selectedInstructorTopicChart}>
        <option value="NewInstructorTopicTime">Instructor Topic Time Heat-Map</option>
        <option value="InstructorTotalTopicTimePieChart">Instructor Topic Time Pie-Chart</option>
        <option value="InstructorTopicBoxPlotChart">Instructor Topic Box Plot Chart</option>
      </select>
      <!-- Display selected topic chart -->
      {#if selectedInstructorTopicChart === "NewInstructorTopicTime"}
        <NewInstructorTopicTime userMap={data.users} topics={data.allTopics} />
      {:else if selectedInstructorTopicChart === "InstructorTotalTopicTimePieChart"}
        <InstructorTotalTopicTimePieChart userMap={data.users} topics={data.allTopics} />
      {:else if selectedInstructorTopicChart === "InstructorTopicBoxPlotChart"}
        <InstructorTopicBoxPlotChart userMap={data.users} topics={data.allTopics} />
      {/if}
    {:else}
      <!-- Dropdown for selecting topic charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleTopicChartChange} bind:value={selectedTopicChart}>
        <option value="NewTopicTime">Topic Time Heat-Map</option>
        <option value="TopicTimeNewChart">Topic Time Pie-Chart</option>
      </select>
      <!-- Display selected topic chart -->
      {#if selectedTopicChart === "NewTopicTime"}
        <NewTopicTime user={data.user} topics={data.allTopics} />
      {:else if selectedTopicChart === "TopicTimeNewChart"}
        <TopicTimeNewChart user={data.user} topics={data.allTopics} />
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
      {#if selectedInstructorLabChart === "NewInstructorLabTime"}
        <NewInstructorLabTime userMap={data.users} allLabs={data.allLabs} />
      {:else if selectedInstructorLabChart === "BoxPlotInstructorChart"}
        <BoxPlotInstructorChart userMap={data.users} allLabs={data.allLabs} />
      {/if}
    {:else}
      <!-- Dropdown for selecting lab charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleLabChartChange} bind:value={selectedLabChart}>
        <option value="NewLabTime">Lab Time Heat-Map</option>
        <option value="LabTimeNewChart">Lab Time Bar/Pie-Chart</option>
      </select>
      <!-- Display selected lab chart -->
      {#if selectedLabChart === "NewLabTime"}
        <NewLabTime user={data.user} allLabs={data.allLabs} />
      {:else if selectedLabChart === "LabTimeNewChart"}
        <LabTimeNewChart user={data.user} allLabs={data.allLabs} />
      {/if}
    {/if}
  {:else if tabSet === 3}
    <LiveStudentFeed userMap={data.users} courseName={data.course.courseId} />
  {/if}
</div>
