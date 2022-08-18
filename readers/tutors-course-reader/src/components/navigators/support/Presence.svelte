<script lang="ts">
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import { PresenceService } from "../../../reader-lib/services/presence-service";
  import { MetricsService } from "../../../reader-lib/services/metrics-service";
  import { currentCourse, currentUser } from "../../../stores";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getUserId } from "tutors-reader-lib/src/utils/auth-utils";
  import { getContext, onDestroy } from "svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { revealOnline } from "../../../stores";

  let user: User;
  let course: Course;
  const timeApp = "https://time.tutors.dev";
  let timeUrl = "";
  let liveUrl = "";
  let gitUrl = "";
  let status = false;
  let show = false;

  const metricsService = getContext("metrics");
  let onlineStudents = 0;
  let students: StudentMetric[] = [];
  let lastCourse: Course = null;
  let presenceService: PresenceService = null;

  function handleClick() {
    status = !status;
    metricsService.setOnlineStatus(user, status);
  }

  currentUser.subscribe(async (newUser) => {
    user = newUser;
    let course = await $currentCourse;
    if (course?.hasEnrollment() && isAuthenticated()) {
      show = true;
      metricsService.setCourse(course);
      if (user && !user.hasOwnProperty("onlineStatus")) {
        user.onlineStatus = "online";
      } else {
        if (user) status = user.onlineStatus === "online";
      }
    }
  });

  function refresh(refreshedStudents: StudentMetric[]) {
    onlineStudents = refreshedStudents.length;
    students = [...refreshedStudents];
  }

  const unsubscribe = currentCourse.subscribe((course: Course) => {
    if (course.hasEnrollment() && isAuthenticated()) {
      if (course != lastCourse) {
        onlineStudents = 0;
        if (presenceService) presenceService.stop();
        presenceService = new PresenceService(new MetricsService(), students, refresh, null);
        lastCourse = course;
        presenceService.setCourse(course);
        presenceService.start();
      }
    } else {
      if (presenceService) presenceService.stop();
      lastCourse = null;
      onlineStudents = 0;
    }
  });
  onDestroy(async () => {
    if (presenceService) presenceService.stop();
  });

  function setTimeUrls() {
    timeUrl = `${timeApp}/#/time/${course?.url}?${getUserId()}`;
    liveUrl = `${timeApp}/#/live/${course?.url}?${getUserId()}`;
  }

  currentUser.subscribe(async (current) => {
    if (current) {
      user = current;
      gitUrl = `https://github.com/${user.nickname}`;
      if (user && current) {
        setTimeUrls();
      }
    }
  });
  currentCourse.subscribe(async (current) => {
    if (current) {
      course = current;
      if (user && current) {
        setTimeUrls();
      }
    }
  });
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
  <div class="flex-none capitalize dropdown dropdown-end dropdown-hover">
    <div class="indicator">
      <span class="indicator-item indicator-top indicator-center badge badge-error">{onlineStudents}</span>
      <button class="btn btn-ghost">
        {#if status}
          <Icon type="online" />
        {/if}
        {#if !status}
          <Icon type="offline" />
        {/if}
      </button>
    </div>
    <ul tabindex="0" class="shadow-xl menu dropdown-content bg-base-100 text-base-content w-48 p-1 rounded-box rounded-xl z-50">
      <li>
        <label class="cursor-pointer label">
          <input type="checkbox" class="checkbox checkbox-primary checkbox-sm" bind:checked={status} on:click={handleClick} />
          <span class="label-text text-base-content text-base">Share Presence</span>
        </label>
      </li>
      <li>
        <button on:click={() => revealOnline.set(true)}>
          <div>View <span class="badge badge-success">{onlineStudents}</span> Online</div>
        </button>
      </li>
    </ul>
  </div>
{/if}
