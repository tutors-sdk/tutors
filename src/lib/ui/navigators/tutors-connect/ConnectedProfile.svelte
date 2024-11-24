<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { presenceService } from "$lib/services/presence.svelte";
  import Icon from "@iconify/svelte";
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";

  let openState = $state(false);

  function logout() {
    tutorsConnectService.disconnect("/");
  }

  function shareStatusChange() {
    tutorsConnectService.toggleShare();
  }
</script>

<Popover
  bind:open={openState}
  positioning={{ placement: "top" }}
  triggerBase="btn"
  contentBase="card bg-surface-50 m-4space-y-4 max-w-[320px] z-[100"
>
  {#snippet trigger()}
    <div class="relative">
      {#if presenceService.studentsOnline.value.length && tutorsConnectService.tutorsId.value?.share}
        <span class="variant-filled-error badge-icon absolute -right-2 -top-2 z-10 text-white">
          {presenceService.studentsOnline.value.length}
        </span>
      {/if}
      <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
        {#if tutorsConnectService.tutorsId.value?.share === "true"}
          <Icon icon="fluent:presence-available-24-filled" color="rgba(var(--color-success-500))" height="20" />
        {:else}
          <Icon icon="fluent:presence-available-24-regular" color="rgba(var(--color-error-500))" height="20" />
        {/if}
      </span>
      <div class="mt-2 flex items-center">
        <Avatar
          classes="size-10"
          src={tutorsConnectService.tutorsId.value?.image}
          name={tutorsConnectService.tutorsId.value?.name}
        />
      </div>
    </div>
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 space-y-4 bg-gray-100 p-4 shadow-lg dark:bg-gray-800" data-popup="design">
      <ul class="space-y-6">
        <li>
          <a href="/" class="flex items-center">
            <Icon icon="fluent:home-24-filled" color="rgba(var(--color-primary-500))" height="20" />
            <div class="ml-2">Home</div>
          </a>
        </li>
        <hr />
        <li class="flex">
          <a onclick={shareStatusChange} class="flex items-center">
            {#if tutorsConnectService.tutorsId.value?.share === "true"}
              <Icon icon="fluent:presence-available-24-filled" color="rgba(var(--color-success-500))" height="20" />
            {:else}
              <Icon icon="fluent:presence-available-24-regular" color="rgba(var(--color-error-500))" height="20" />
            {/if}
            <div class="ml-2">Share Presence</div>
          </a>
        </li>
        {#if tutorsConnectService.tutorsId.value?.share === "true"}
          <li>
            <a
              href="https://time.tutors.dev/{currentCourse.value?.courseId}"
              target="_blank"
              rel="noreferrer"
              class="flex items-center"
            >
              <Icon icon="fluent:clock-alarm-24-filled" color="rgba(var(--color-primary-500))" height="20" />
              <div class="ml-2">Tutors Time</div>
            </a>
          </li>
          <li>
            <a
              href="https://live.tutors.dev/course/{currentCourse.value?.courseId}"
              target="_blank"
              rel="noreferrer"
              class="flex items-center"
            >
              <Icon icon="fluent:people-list-24-filled" color="rgba(var(--color-primary-500))" height="20" />
              <div class="ml-2">Tutors Live</div>
            </a>
          </li>
          <li class="flex items-center">
            <Icon icon="fluent:people-list-24-filled" color="rgba(var(--color-primary-500))" height="20" />
            <div class="ml-2">
              View <span class="badge bg-error-500 text-white">{presenceService.studentsOnline.value.length}</span> Online
            </div>
          </li>
          <hr />
        {/if}
        <li>
          <a
            href="https://github.com/{tutorsConnectService.tutorsId.value?.login}"
            target="_blank"
            rel="noreferrer"
            class="flex items-center"
          >
            <Icon icon="mdi:github" height="20" />
            <div class="ml-2">Github Profile</div>
          </a>
        </li>
        <li>
          <button onclick={logout} class="flex w-full items-center">
            <Icon icon="fluent:sign-out-24-filled" color="rgba(var(--color-error-500))" height="20" />
            <div class="ml-2">Disconnect</div>
          </button>
        </li>
      </ul>
    </nav>
  {/snippet}
</Popover>
