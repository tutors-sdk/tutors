<script lang="ts">
  import TitleCard from "./support/TitleCard.svelte";
  import { courseUrl, currentCourse,currentUser, studentsOnline, studentsOnlineList, layout, calendarDrawer, infoDrawer, tocDrawer, storeTheme } from "../../stores";
  import Avatar from "./support/Avatar.svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import type { MetricsService } from "../../reader-lib/services/metrics-service";
  import { PresenceService } from "../../reader-lib/services/presence-service";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { AppBar, LightSwitch, menu, Divider } from "@brainandbones/skeleton";

  function applyInitialLayout() {
    const savedLayout = window.localStorage.getItem("site-layout");
    if (savedLayout != null) {
      layout.set(savedLayout);
    } else {
      layout.set("expanded");
      window.localStorage.setItem("site-layout", "expanded");
    }
  }

  function toggleLayout() {
    if ($layout === "compacted") {
      layout.set("expanded");
      window.localStorage.setItem("site-layout", "expanded");
    } else {
      layout.set("compacted");
      window.localStorage.setItem("site-layout", "compacted");
    }
  }

  const infoDrawerOpen: any = () => { infoDrawer.set(true) };
  const calendarDrawerOpen: any = () => { calendarDrawer.set(true) };
  const tocDrawerOpen: any = () => { tocDrawer.set(true) };

  const metricsService: MetricsService = getContext("metrics");
  let students: StudentMetric[] = [];
  let presenceService: PresenceService = null;
  let lastCourse: Course = null;
  let user: User;

  function refresh(refreshedStudents: StudentMetric[]) {
    let student = refreshedStudents.find((student) => student.nickname === user.nickname);
    let index = refreshedStudents.indexOf(student);
    if (index !== -1) {
      refreshedStudents.splice(index, 1);
    }
    studentsOnlineList.set([...refreshedStudents]);
    studentsOnline.set(refreshedStudents.length);
  }

  async function initService(course: Course) {
    if (presenceService) presenceService.stop();
    metricsService.setCourse(course);
    presenceService = new PresenceService(metricsService, students, refresh, null);
    presenceService.setCourse(course);
    await presenceService.start();
    studentsOnlineList.set([]);
    studentsOnline.set(0);
  }

  currentCourse.subscribe((newCourse: Course) => {
    if (newCourse && newCourse != lastCourse) {
      lastCourse = newCourse;
      if (isAuthenticated() && newCourse?.authLevel > 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        initService(newCourse);
      }
    }
  });

  currentUser.subscribe((newUser) => {
    user = newUser;
  });

  applyInitialLayout();
</script>

{#if $currentCourse}
  <AppBar class="h-24 space-x-1 lg:space-x-4">
    <svelte:fragment slot="lead">
      <div class="flex">
        {#if $currentCourse?.lo.contentMd}
          <button class="btn btn-sm" on:click={infoDrawerOpen}>
            <Icon type="courseinfo" />
          </button>
        {/if}
        <TitleCard />
      </div>
    </svelte:fragment>
    {#if $currentCourse.currentWeek}
      <div class="hidden lg:flex w-full">
        <div class="inline-flex mx-auto p-2 rounded-lg bg-surface-200 dark:bg-surface-700">
          <div class="pr-4">
            <div class="pt-1 text-sm">Current Week</div>
            <div class="text-l font-bold pb-1 text-center">{$currentCourse.currentWeek.title}</div>
          </div>

        <Divider vertical={true} borderWidth="border-l" />
        <button class="btn btn-sm" on:click={calendarDrawerOpen}>
          <Icon type="calendar" />
        <span class="font-bold text-sm">Calendar</span>
        </button>
        </div>
      </div>
    {/if}
    <svelte:fragment slot="trail">
      <div class="flex items-center space-x-1 lg:space-x-4">
      {#if !$currentCourse.isPortfolio()}
      <a class="btn btn-sm" href="/#/search/{$courseUrl}"><Icon type="search" />
      <span class="hidden lg:block font-bold text-sm">Search</span>
    </a>
    <Divider vertical={true} borderWidth="border-l" class="hidden lg:block" />
      {/if}
      <div class="relative">
      <button class="btn btn-sm" use:menu={{ menu: 'design', interactive: true }}>
        <Icon type="dark" />
        <span class="hidden lg:block font-bold text-sm">Layout</span>
        <span class="opacity-50">▾</span>
      </button>
      <nav class="list-nav card card-body w-56 shadow-lg space-y-4" data-menu="design">
        <h6>Toggles</h6>
        <section class="flex justify-between">
					<p class="text-lg">Dark Mode</p>
					<LightSwitch origin="tr" />
				</section>
        <button class="w-full" on:click={() => toggleLayout()}>
        <section class="flex justify-between">
					<p class="text-lg">Compact</p>
          <div class="mr-3">
            <Icon type={$layout} />
          </div>
				</section>
      </button>
      <hr>
      <h6>Themes</h6>
        <ul>
          <li class="option" class:!bg-primary-500={$storeTheme === 'tutors'} on:click={() => { storeTheme.set('tutors') }}> 
            <p class="text-lg">Tutors</p>
          </li>
          <li class="option" class:!bg-primary-500={$storeTheme === 'dyslexia'} on:click={() => { storeTheme.set('dyslexia') }}> 
            <p class="text-lg">Dyslexia</p>
          </li>
          <li class="option" class:!bg-primary-500={$storeTheme === 'halloween'} on:click={() => { storeTheme.set('halloween') }}> 
            <p class="text-lg">Halloween</p>
          </li>
        </ul>
      </nav>
    </div>
    <Divider vertical={true} borderWidth="border-l"  class="hidden lg:block" />
      <Avatar />
      <button class="btn btn-sm" on:click={tocDrawerOpen}>
        <Icon type="toc" />
      </button></div>
      </svelte:fragment
    >
  </AppBar>
{/if}
