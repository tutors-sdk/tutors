<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import LabTime from "$lib/ui/time/LabTime.svelte";
  import InstructorLabTime from "$lib/ui/time/InstructorLabTime.svelte";
  import InstructorCalendarTime from "$lib/ui/time/InstructorCalendarTime.svelte";
  import CalendarTime from "$lib/ui/time/CalendarTime.svelte";

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
      tabSet = 3;
      if (!data.course?.hasCalendar) {
        tabSet = 4;
      }
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css" />
</svelte:head>

<div in:fade={{ duration: 500 }} class="bg-base-200 mt-3">
  <TabGroup selected={storeTab}>
    {#if !instructorMode}
      {#if data.course?.hasCalendar}
        <Tab bind:group={tabSet} name="calendar" value={0}>Calendar</Tab>
      {/if}
      <Tab bind:group={tabSet} name="labs" value={1}>Labs</Tab>
      <Tab bind:group={tabSet} name="labs-chart" value={2}>Labs (chart)</Tab>
    {:else}
      {#if data.course?.hasCalendar}
        <Tab bind:group={tabSet} name="calendar-all" value={3}>Calendar</Tab>
      {/if}
      {#if data.course?.hasEnrollment}
        <Tab bind:group={tabSet} name="LabsAllStudent" value={4}>Labs (enrolled)</Tab>
      {/if}
      <Tab bind:group={tabSet} name="LabsAllStudent" value={5}>Labs(all)</Tab>
      <Tab bind:group={tabSet} name="allLabsChart" value={6}>Labs(all chart)</Tab>
    {/if}
  </TabGroup>
  {#if tabSet === 0}
    {#if data.course?.hasCalendar}
      <CalendarTime user={data.user} calendarData={data.calendar} />
    {/if}
  {:else if tabSet === 1}
    <LabTime user={data.user} allLabs={data.allLabs} chart={false} />
  {:else if tabSet === 2}
    <LabTime user={data.user} allLabs={data.allLabs} chart={true} />
  {:else if tabSet === 3}
    <InstructorCalendarTime userMap={data.users} calendarData={data.calendar} />
  {:else if tabSet === 4}
    <InstructorLabTime userMap={data.enrolledUsers} allLabs={data.allLabs} chart={false} />
  {:else if tabSet === 5}
    <InstructorLabTime userMap={data.users} allLabs={data.allLabs} chart={false} />
  {:else if tabSet === 6}
    <InstructorLabTime userMap={data.enrolledUsers} allLabs={data.allLabs} chart={true} />
  {/if}
</div>
