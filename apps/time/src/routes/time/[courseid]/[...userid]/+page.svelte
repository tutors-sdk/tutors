<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";

  import { currentUser, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import LabTime from "$lib/time/LabTime.svelte";
  import InstructorLabTime from "$lib/time/InstructorLabTime.svelte";
  import InstructorCalendarTime from "$lib/time/InstructorCalendarTime.svelte";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import CalendarTime from "$lib/time/CalendarTime.svelte";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { page } from "$app/stores";

  export let data: PageData;
  const storeTab: Writable<string> = writable("Labs");
  let pinBuffer = "";
  let instructorMode = false;
  let tabSet: number = 0;

  onMount(async () => {
    window.addEventListener("keydown", keypressInput);
    authService.checkAuth($currentCourse);
  });

  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === data.ignorePin) {
      instructorMode = true;
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css" />
</svelte:head>

<NavBar title="{data.course.lo.title}" subTitle="{$currentUser?.name}" />

<div in:fade="{{ duration: 500 }}" class="bg-base-200 mt-3 ">
  <TabGroup selected="{storeTab}">
    <Tab bind:group="{tabSet}" name="Labs" value="{0}">Labs</Tab>
    <Tab bind:group="{tabSet}" name="LabsChart" value="{1}">LabsChart</Tab>
    <Tab bind:group="{tabSet}" name="Calendar" value="{2}">Calendar</Tab>

    {#if instructorMode}
      <Tab bind:group="{tabSet}" name="LabsAllStudent" value="{3}">Labs All Student</Tab>
      {#if data.course.hasEnrollment()}
        <Tab bind:group="{tabSet}" name="LabsAllStudent" value="{4}">Labs All Enrolled Student</Tab>
      {/if}
      <Tab bind:group="{tabSet}" name="allLabsChart" value="{5}">Labs All Students - Chart</Tab>
      <Tab bind:group="{tabSet}" name="allLabsChart" value="{6}">Calendar All Students</Tab>
    {/if}
  </TabGroup>
  {#if tabSet === 0}
    <LabTime user="{data.user}" allLabs="{data.allLabs}" chart="{false}" />
  {:else if tabSet === 1}
    <LabTime user="{data.user}" allLabs="{data.allLabs}" chart="{true}" />
  {:else if tabSet === 2}
    <CalendarTime user="{data.user}" calendarData="{data.calendar}" />
  {:else if tabSet === 3}
    <InstructorLabTime userMap="{data.users}" allLabs="{data.allLabs}" chart="{false}" />
  {:else if tabSet === 4}
    <InstructorLabTime userMap="{data.enrolledUsers}" allLabs="{data.allLabs}" chart="{false}" />
  {:else if tabSet === 5}
    <InstructorLabTime userMap="{data.users}" allLabs="{data.allLabs}" chart="{true}" />
  {:else if tabSet === 6}
    <InstructorCalendarTime userMap="{data.users}" calendarData="{data.calendar}" />
  {/if}
</div>

<style global>
  .ag-header-cell-label .ag-header-cell-text {
    writing-mode: vertical-lr;
  }

  .ag-row .ag-cell {
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center;
  }

  div.ag-theme-balham div.ag-row {
    font-size: 10px !important;
  }

  .yellow {
    background-color: yellow;
    color: grey;
  }

  .green-1 {
    background-color: #00d000;
    color: white;
  }
  .green-2 {
    background-color: #00c000;
    color: white;
  }
  .green-3 {
    background-color: #00b000;
    color: white;
  }
  .green-4 {
    background-color: #00a000;
    color: white;
  }
  .green-5 {
    background-color: #009000;
    color: white;
  }
  .green-6 {
    background-color: #008000;
    color: white;
  }
  .green-7 {
    background-color: #007000;
    color: white;
  }
  .green-8 {
    background-color: #006000;
    color: white;
  }
  .green-9 {
    background-color: #005800;
    color: white;
  }
  .green-10 {
    background-color: #005000;
  }
  .green-11 {
    background-color: #004800;
    color: white;
  }

  /* https://www.cssportal.com/html-colors/shades-of-green.php */

  .d-green-1 {
    background-color: #00ff00;
    color: white;
  }
  .d-green-2 {
    background-color: #00f800;
    color: white;
  }
  .d-green-3 {
    background-color: #00f000;
    color: white;
  }
  .d-green-4 {
    background-color: #00e800;
    color: white;
  }
  .d-green-5 {
    background-color: #00e000;
    color: white;
  }
  .d-green-6 {
    background-color: #00d800;
    color: white;
  }
  .d-green-7 {
    background-color: #00d000;
    color: white;
  }
  .d-green-8 {
    background-color: #00c800;
    color: white;
  }
  .d-green-9 {
    background-color: #00c000;
    color: white;
  }
  .d-green-10 {
    background-color: #00b800;
  }
  .d-green-11 {
    background-color: #00b000;
    color: white;
  }
  .d-green-12 {
    background-color: #00a800;
    color: white;
  }
  .d-green-13 {
    background-color: #00a000;
    color: white;
  }
  .d-green-14 {
    background-color: #009800;
    color: white;
  }
  .d-green-15 {
    background-color: #009000;
  }
  .d-green-16 {
    background-color: #008800;
    color: white;
  }
  .d-green-17 {
    background-color: #008000;
    color: white;
  }
  .d-green-18 {
    background-color: #007800;
    color: white;
  }
  .d-green-19 {
    background-color: #007000;
    color: white;
  }
  .d-green-20 {
    background-color: #006800;
    color: white;
  }
  .d-green-21 {
    background-color: #006000;
    color: white;
  }
  .d-green-22 {
    background-color: #005800;
    color: white;
  }
  .d-green-23 {
    background-color: #006000;
    color: white;
  }
  .d-green-24 {
    background-color: #005800;
    color: white;
  }
  .d-green-25 {
    background-color: #005000;
    color: white;
  }
  .d-green-26 {
    background-color: #004800;
    color: white;
  }
  .d-green-27 {
    background-color: #004000;
    color: white;
  }
  .d-green-28 {
    background-color: #003800;
    color: white;
  }
  .d-green-29 {
    background-color: #003000;
    color: white;
  }
  .d-green-30 {
    background-color: #002800;
    color: white;
  }
  .d-green-31 {
    background-color: #002020;
    color: white;
  }
  .d-green-32 {
    background-color: #001800;
    color: white;
  }
  .d-green-33 {
    background-color: #001000;
    color: white;
  }
  .d-green-34 {
    background-color: #000800;
    color: white;
  }
  .d-green-35 {
    background-color: #000000;
    color: white;
  }
</style>
