<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import LabTime from "./support/LabTime.svelte";
  import InstructorLabTime from "./support/InstructorLabTime.svelte";
  import CalendarTime from "./support/CalendarTime.svelte";
  import InstructorCalendarTime from "./support/InstructorCalendarTime.svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { Tab, TabGroup } from "@brainandbones/skeleton";
  import { querystring } from "svelte-spa-router";
  import { currentUser } from "tutors-reader-lib/src/stores/stores";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import type { MetricsService } from "tutors-reader-lib/src/services/metrics-service";
  import NavBar from "../navigators/NavBar.svelte";
  import { writable, type Writable } from "svelte/store";

  const storeTab: Writable<string> = writable("Labs");
  export let params: Record<string, string> = {};
  let instructorMode = false;
  let course: Course;
  const cache: CourseService = getContext("cache");
  const metricsService: MetricsService = getContext("metrics");
  let title = "";
  let pinBuffer = "";
  let ignorePin = "";
  let id = "";

  window.addEventListener("keydown", keypressInput);

  async function getCourse(url: string) {
    id = $querystring;
    course = await cache.readCourse(url);
    metricsService.setCourse(course);
    const user = await metricsService.fetchUserById(id);
    currentUser.set(user);
    title = `${course.lo.title}: TutorTime data`;
    if (course.lo.properties.ignorepin) {
      ignorePin = course.lo.properties.ignorepin.toString();
    }
    return course;
  }

  function keypressInput(e: KeyboardEvent) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      instructorMode = true;
    }
  }

  onDestroy(() => {
    window.removeEventListener("keydown", keypressInput);
  });
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css" />
  <link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-theme-balham.css" />
</svelte:head>

{#await getCourse(params.wild) then course}
  <div class="sticky top-0 z-40 mb-5">
    <NavBar {title} subTitle={$currentUser.name} />
  </div>

  <!-- <div in:fade={{ duration: 500 }} class="bg-base-200 mt-4 container mx-auto rounded-box"> -->
  <div in:fade={{ duration: 500 }} class="bg-base-200 mt-4 ">
    <TabGroup selected={storeTab}>
      <Tab value="Labs">Labs</Tab>
      <Tab value="LabsChart">Labs Chart</Tab>
      <Tab value="Calendar">Calendar</Tab>
      {#if instructorMode}
        <Tab value="allLabs">Labs All Students</Tab>
        <Tab value="allLabsChart">Labs All Students - Chart</Tab>
        <Tab value="allCalendar">Calendar All Students</Tab>
      {/if}
    </TabGroup>
    {#if $storeTab === "Labs"}
      <LabTime {id} chart={false} />
    {/if}
    {#if $storeTab === "LabsChart"}
      <LabTime {id} chart={true} />
    {/if}
    {#if $storeTab === "Calendar"}
      <CalendarTime {id} />
    {/if}
    {#if $storeTab === "allLabs"}
      <InstructorLabTime />
    {/if}
    {#if $storeTab === "allLabsChart"}
      <InstructorLabTime chart={true} />
    {/if}
    {#if $storeTab === "allCalendar"}
      <InstructorCalendarTime />
    {/if}
  </div>
{/await}
