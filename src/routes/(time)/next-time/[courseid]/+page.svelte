<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import BoxPlotInstructorChart from "$lib/ui/time/supabase/InstructorLabViewBoxPlot.svelte";
  import CalendarTimeNewChart from "$lib/ui/time/supabase/CalendarView.svelte";
  import InstructorTopicBoxPlotChart from "$lib/ui/time/supabase/InstructorTopicViewBoxPlot.svelte";
  import InstructorTotalTopicTimePieChart from "$lib/ui/time/supabase/InstructorTopicViewPieChart.svelte";
  import LabTimeNewChart from "$lib/ui/time/supabase/LabViewPieChart.svelte";
  import LiveStudentFeed from "$lib/ui/time/supabase/LiveStudentFeed.svelte";
  import NewInstructorCalendarTime from "$lib/ui/time/supabase/InstructorCalendarView.svelte";
  import NewInstructorLabTime from "$lib/ui/time/supabase/InstructorLabView.svelte";
  import NewInstructorTopicTime from "$lib/ui/time/supabase/InstructorTopicView.svelte";
  import LabView from "$lib/ui/time/supabase/LabView.svelte";
  import NewTopicTime from "$lib/ui/time/supabase/TopicView.svelte";
  import TopicTimeNewChart from "$lib/ui/time/supabase/TopicViewPieChart.svelte";

  export let data: any;

  const storeTab: Writable<string> = writable("Labs");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet = 0;
  let selectedLabChart: string = "LabView"; // Set default lab chart
  let selectedTopicChart: string = "NewTopicTime"; // Set default topic chart
  let selectedInstructorLabChart: string = "NewInstructorLabTime"; // Set default instructor lab chart
  let selectedInstructorTopicChart: string = "NewInstructorTopicTime"; // Set default instructor topic chart

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
    if (!data?.course.hasCalendar) {
      tabSet = 0;
    }
  });

  // Event handling function
  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.ignorePin) {
      instructorMode = true;
      tabSet = 0;
      if (!data?.course.hasCalendar) {
        tabSet = 1;
      }
    }
  };

  // Event handler for dropdown change
  function handleLabChartChange(event: Event) {
    selectedLabChart = (event.target as HTMLSelectElement).value;
  };

  // Event handler for dropdown change
  function handleTopicChartChange(event: Event) {
    selectedTopicChart = (event.target as HTMLSelectElement).value;
  };

  // Event handler for dropdown change
  function handleInstructorLabChartChange(event: Event) {
    selectedInstructorLabChart = (event.target as HTMLSelectElement).value;
  };

  // Event handler for dropdown change
  function handleInstructorTopicChartChange(event: Event) {
    selectedInstructorTopicChart = (event.target as HTMLSelectElement).value;
  };
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
      <!-- <NewInstructorCalendarTime course={data}  /> -->
    {:else}
      <!-- <CalendarTimeNewChart course={data} /> -->
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
      <!-- {#if selectedInstructorTopicChart === "NewInstructorTopicTime"}
        <NewInstructorTopicTime course={data}/>
      {:else if selectedInstructorTopicChart === "InstructorTotalTopicTimePieChart"}
        <InstructorTotalTopicTimePieChart course={data}/>
      {:else if selectedInstructorTopicChart === "InstructorTopicBoxPlotChart"}
        <InstructorTopicBoxPlotChart course={data}/>
      {/if} -->
    {:else}
      <!-- Dropdown for selecting topic charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleTopicChartChange} bind:value={selectedTopicChart}>
        <option value="NewTopicTime">Topic Time Heat-Map</option>
        <option value="TopicTimeNewChart">Topic Time Pie-Chart</option>
      </select>
      <!-- Display selected topic chart -->
      <!-- {#if selectedTopicChart === "NewTopicTime"}
        <NewTopicTime user={data.user} topics={data.allTopics} />
      {:else if selectedTopicChart === "TopicTimeNewChart"}
        <TopicTimeNewChart user={data.user} topics={data.allTopics} />
      {/if} -->
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
        <NewInstructorLabTime course={data.course} session={data.session} userIds={data.userIds} />  
      {:else if selectedInstructorLabChart === "BoxPlotInstructorChart"}
        <!-- <BoxPlotInstructorChart course={data} /> -->
      {/if} 
    {:else}
      <!-- Dropdown for selecting lab charts -->
      <select class="mt-2 block w-full py-2 px-3 border rounded-md shadow-sm bg-white" on:change={handleLabChartChange} bind:value={selectedLabChart}>
        <option value="NewLabTime">Lab Time Heat-Map</option>
        <option value="LabTimeNewChart">Lab Time Bar/Pie-Chart</option>
      </select>
      <!-- Display selected lab chart -->
      {#if selectedLabChart === "LabView"}
        <!-- <LabView course={data.course} session={data.session} /> -->
        <NewInstructorLabTime course={data.course} session={data.session} userIds={data.userIds} />  

      <!-- {:else if selectedLabChart === "LabTimeNewChart"}
        <LabTimeNewChart user={data.user} allLabs={data.allLabs} /> -->
      {/if}
    {/if}
  {:else if tabSet === 3}
    <LiveStudentFeed userMap={data.users} courseName={data.course.courseId} />
  {/if}
</div>



