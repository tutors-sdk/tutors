<script lang="ts">
  import { currentCourse, currentUser } from "../../../stores";
  import type { User } from "tutors-reader-lib/src/types/metrics-types";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";
  import { getUserId } from "tutors-reader-lib/src/utils/auth-utils";
  import { menu, Avatar } from "@brainandbones/skeleton";

  let user: User;
  let course: Course;
  const timeApp = "https://time.tutors.dev";
  let timeUrl = "";
  let liveUrl = "";
  let gitUrl = "";

  function setTimeUrls() {
    timeUrl = `${timeApp}/#/time/${course?.url}?${getUserId()}`;
    liveUrl = `${timeApp}/#/live/${course?.url}?${getUserId()}`;
  }

  currentUser.subscribe((current) => {
    if (current) {
      user = current;
      gitUrl = `https://github.com/${user.nickname}`;
      if (user && current) {
        setTimeUrls();
      }
    }
  });
  currentCourse.subscribe((current) => {
    if (current) {
      course = current;
      if (user && current) {
        setTimeUrls();
      }
    }
  });
</script>

{#if $currentUser && $currentCourse.authLevel > 0}

<div class="relative">
  <button class="btn btn-sm space-x-1" use:menu={{ menu: 'avatar' }}>
    <Avatar width="w-10" src={$currentUser.picture} alt={$currentUser.nickname} />
  </button>
  <nav class="list-nav card card-body w-56 shadow-xl space-y-4" data-menu="avatar">
    <div class="mt-2 mb-1 ml-4 text-xs">Logged in as:</div>
    <div class="mb-1 ml-4 text-sm">{$currentUser.name}</div>
    <ul>
      <li>
        <a href={timeUrl} target="_blank">
          <Icon type="tutorsTime" />
          <div class="ml-2">Tutors Time</div>
        </a>
      </li>
      <li>
        <a href={liveUrl} target="_blank">
          <Icon type="live" />
          <div class="ml-2">Tutors Live</div>
        </a>
      </li>
      <li>
        <a href={gitUrl} target="_blank">
          <Icon type="github" />
          <div class="ml-2">Github Profile</div>
        </a>
      </li>
      <li>
        <a href="#/logout">
          <Icon type="logout" />
          <div class="ml-2">Logout</div>
        </a>
      </li>
    </ul>
  </nav>
</div>
{/if}
