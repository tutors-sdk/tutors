<script lang="ts">
  import {
    currentCourse,
    currentUser,
    studentsOnline,
    onlineDrawer
  } from 'tutors-reader-lib/src/stores/stores';
  import type { User } from 'tutors-reader-lib/src/types/metrics-types';
  import type { Course } from 'tutors-reader-lib/src/models/course';
  import Icon from 'tutors-reader-lib/src/iconography/Icon.svelte';
  import { getUserId, isAuthenticated } from 'tutors-reader-lib/src/utils/auth-utils';
  import { getContext } from 'svelte';
  import type { MetricsService } from 'tutors-course-reader/src/reader-lib/services/metrics-service';
  import { menu, Avatar, Divider } from '@brainandbones/skeleton';

  let user: User;
  let course: Course;
  let status = false;
  const timeApp = 'https://time.tutors.dev';
  let timeUrl = '';
  let liveUrl = '';
  let gitUrl = '';

  const metricsService: MetricsService = getContext('metrics');

  function setTimeUrls() {
    timeUrl = `${timeApp}/#/time/${course?.url}?${getUserId()}`;
    liveUrl = `${timeApp}/#/live/${course?.url}?${getUserId()}`;
  }

  currentCourse.subscribe((current) => {
    if (current) {
      course = current;
      if (user && current) {
        setTimeUrls();
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  currentUser.subscribe(async (newUser) => {
    user = newUser;
    gitUrl = `https://github.com/${user.nickname}`;
    if (user && newUser) {
      setTimeUrls();
    }
    let course = await $currentCourse;
    if (isAuthenticated() && course.authLevel > 0) {
      // eslint-disable-next-line no-prototype-builtins
      if (user && !user.hasOwnProperty('onlineStatus')) {
        user.onlineStatus = 'online';
      } else {
        if (user) status = user.onlineStatus === 'online';
      }
    }
  });

  function handleClick() {
    status = !status;
    metricsService.setOnlineStatus(user, status);
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  currentUser.subscribe(async (newUser) => {
    user = newUser;
    let course = await $currentCourse;
    if (isAuthenticated() && course.authLevel > 0) {
      // eslint-disable-next-line no-prototype-builtins
      if (user && !user.hasOwnProperty('onlineStatus')) {
        user.onlineStatus = 'online';
      } else {
        if (user) status = user.onlineStatus === 'online';
      }
    }
  });

  const onlineDrawerOpen: any = () => {
    onlineDrawer.set(true);
  };
</script>

{#if $currentUser && $currentCourse.authLevel > 0}
  <div class="relative">
    <button class="btn btn-sm space-x-1" use:menu="{{ menu: 'avatar', interactive: true }}">
      <div class="relative inline-block">
        {#if status && studentsOnline}
          <span class="badge-icon bg-warning-500 absolute -top-2 -right-2 z-10 text-white"
            >{$studentsOnline}</span
          >
        {/if}
        <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
          {#if status}
            <Icon type="online" />
          {/if}
          {#if !status}
            <Icon type="offline" />
          {/if}</span
        >
        <Avatar width="w-10" src="{$currentUser.picture}" alt="{$currentUser.nickname}" />
      </div>
    </button>
    <nav class="list-nav card card-body w-56 space-y-4 shadow-lg" data-menu="avatar">
      <span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
      <span class="ml-4 text-sm">{$currentUser.name}</span>
      <Divider />
      <ul>
        <li class="flex">
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
          <a href="{timeUrl}" target="_blank">
            <Icon type="tutorsTime" />
            <div class="ml-2">Tutors Time</div>
          </a>
        </li>
        <li>
          <a href="{liveUrl}" target="_blank">
            <Icon type="live" />
            <div class="ml-2">Tutors Live</div>
          </a>
        </li>
        <li>
          <a href="{gitUrl}" target="_blank">
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
