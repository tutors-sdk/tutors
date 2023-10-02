<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onlineStatus } from "$lib/stores";
  import type { Session } from "@supabase/supabase-js";

  export let session: Session;
  export let usersOnline: string = "";
  export let currentCourseId: string = "";
  export let currentCourseUrl: string = "";
  export let handleOnlineStatusChange: () => void;
  export let handleSignOut: () => void;
  export let onlineDrawerOpen: () => void;
</script>

<nav class="list-nav card card-body w-56 p-4 space-y-4 shadow-lg" data-popup="avatar">
  <span class="mt-2 ml-4 text-xs">Logged in as:</span><br />
  <span class="ml-4 text-sm">{session.user.user_metadata.name != undefined ? session.user.user_metadata.name : session.user.user_metadata.user_name}</span>
  <ul>
    <li>
      <a href="/dashboard">
        <Icon icon="fluent:home-24-filled" color="rgba(var(--color-primary-500))" height="20" />
        <div class="ml-2">Dashboard</div>
      </a>
    </li>

    <hr />
    <li class="flex">
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <a on:click={handleOnlineStatusChange}>
        {#if $onlineStatus}
          <Icon icon="fluent:presence-available-24-filled" color="rgba(var(--color-success-500))" height="20" />
        {:else}
          <Icon icon="fluent:presence-available-24-regular" color="rgba(var(--color-error-500))" height="20" />
        {/if}
        <div class="ml-2">Share Presence</div>
      </a>
    </li>
    {#if $onlineStatus}
      <li>
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <a on:click={onlineDrawerOpen}>
          <Icon icon="fluent:people-list-24-filled" color="rgba(var(--color-primary-500))" height="20" />
          <div class="ml-2">
            View <span class="badge bg-error-500 text-white">{usersOnline}</span> Online
          </div>
        </a>
      </li>
      <hr />
      {#if $onlineStatus}
        <li>
          <a href="/active/{currentCourseId}" target="_blank" rel="noreferrer">
            <Icon icon="fluent:people-list-24-filled" color="rgba(var(--color-primary-500))" height="20" />
            <div class="ml-2">Tutors Live</div>
          </a>
        </li>
      {/if}
      <li>
        <a href="/time/{currentCourseUrl}" rel="noreferrer">
          <Icon icon="fluent:clock-alarm-24-filled" color="rgba(var(--color-primary-500))" height="20" />
          <div class="ml-2">Tutors Time</div>
        </a>
      </li>
      <hr />
    {/if}
    <li>
      <a href="https://github.com/{session.user.user_metadata.preferred_username}" target="_blank" rel="noreferrer">
        <Icon icon="mdi:github" height="20" />
        <div class="ml-2">Github Profile</div>
      </a>
    </li>
    <li>
      <button on:click={handleSignOut} class="w-full">
        <Icon icon="fluent:sign-out-24-filled" color="rgba(var(--color-error-500))" height="20" />
        <div class="ml-2">Logout</div>
      </button>
    </li>
  </ul>
</nav>
