<script lang="ts">
  import { currentCourse, currentUser, studentsOnline, onlineDrawer } from "tutors-reader-lib/src/stores/stores";
  import type { User } from "tutors-reader-lib/src/types/auth-types";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import Icon from "../../Atoms/Icon/Icon.svelte";
  import { analyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { menu, Avatar, Divider } from "@skeletonlabs/skeleton";

  let user: User;
  let status = false;
  const timeApp = "https://tutors-time-kit.netlify.app";
  let timeUrl = "";
  let gitUrl = "";

  function setTimeUrls(user: User, course: Course) {
    timeUrl = `${timeApp}/time/${course?.url}/${user.userId}`;
  }

  currentUser.subscribe(async (newUser: User) => {
    if (newUser) {
      user = newUser;
      gitUrl = `https://github.com/${user?.nickname}`;
      let course = await $currentCourse;
      if (user && course) {
        setTimeUrls(user, course);
        status = user.onlineStatus === "online";
      }
    }
  });

  function handleClick() {
    status = !status;
    analyticsService.setOnlineStatus(status);
  }

  const onlineDrawerOpen: any = () => {
    onlineDrawer.set(true);
  };
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
  <div class="relative">
    <button class="btn btn-sm space-x-1" use:menu="{{ menu: 'avatar', interactive: true }}">
      <div class="relative inline-block">
        {#if status && studentsOnline}
          <span class="badge-icon bg-warning-500 absolute -top-2 -right-2 z-10 text-white">{$studentsOnline}</span>
        {/if}
        <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
          {#if status}
            <Icon type="online" />
          {/if}
          {#if !status}
            <Icon type="offline" />
          {/if}</span
        >
        <Avatar width="w-10" src="{$currentUser.picture}" alt="{$currentUser?.nickname}" />
      </div>
    </button>
    <nav class="list-nav card card-body w-56 space-y-4 shadow-lg" data-menu="avatar">
      <span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
      <span class="ml-4 text-sm">{$currentUser.name}</span>
      <Divider />
      <ul>
        <li class="flex">
          <!-- svelte-ignore a11y-missing-attribute -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <a on:click="{handleClick}">
            {#if status}
              <Icon type="online" />
            {/if}
            {#if !status}
              <Icon type="offline" />
            {/if}
            <div class="ml-2">Share Presence</div>
          </a>
        </li>
        {#if status}
          <li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <a on:click="{onlineDrawerOpen}">
              <Icon type="listOnline" />
              <div class="ml-2">
                View <span class="badge bg-warning-500 text-white">{$studentsOnline}</span> Online
              </div>
            </a>
          </li>
        {/if}
      </ul>
      <Divider />
      <ul>
        <li>
          <a href="{timeUrl}" target="_blank" rel="noreferrer">
            <Icon type="tutorsTime" />
            <div class="ml-2">Tutors Time</div>
          </a>
        </li>
        <li>
          <a href="{gitUrl}" target="_blank" rel="noreferrer">
            <Icon type="github" />
            <div class="ml-2">Github Profile</div>
          </a>
        </li>
        <li>
          <a href="/logout" rel="noreferrer">
            <Icon type="logout" />
            <div class="ml-2">Logout</div>
          </a>
        </li>
      </ul>
    </nav>
  </div>
{/if}
