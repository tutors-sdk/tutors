<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { presenceService } from "$lib/services/presence.svelte";
  import MenuItem from "../../components/MenuItem.svelte";
  import Menu from "$lib/ui/components/Menu.svelte";
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
  import OnlineButton from "../buttons/OnlineButton.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  function logout() {
    tutorsConnectService.disconnect("/");
  }

  function shareStatusChange() {
    tutorsConnectService.toggleShare();
  }
</script>

{#snippet menuSelector()}
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
        classes="size-9"
        src={tutorsConnectService.tutorsId.value?.image}
        name={tutorsConnectService.tutorsId.value?.name}
      />
    </div>
  </div>
{/snippet}

{#snippet menuContent()}
  <ul class="space-y-3">
    <MenuItem link="/" text="Home" type="tutors" />
    <hr />
    {#if tutorsConnectService.tutorsId.value?.share === "true"}
      <MenuItem text="Share Presence" type="online" onClick={shareStatusChange} />
    {:else}
      <MenuItem text="Share Presence" type="offline" onClick={shareStatusChange} />
    {/if}
    {#if tutorsConnectService.tutorsId.value?.share === "true"}
      <MenuItem
        link="https://time.tutors.dev/{currentCourse.value?.courseId}"
        text="Tutors Time"
        type="tutorsTime"
        targetStr="_blank"
      />
      <MenuItem
        link="https://live.tutors.dev/course/{currentCourse.value?.courseId}"
        text="Tutors Live"
        type="live"
        targetStr="_blank"
      />

      <li class="option !p-0 hover:preset-tonal">
        <OnlineButton />
      </li>

      <hr />
    {/if}
    <MenuItem
      link="https://github.com/{tutorsConnectService.tutorsId.value?.login}"
      text="Github Profile"
      type="github"
      targetStr="_blank"
    />
    <MenuItem text="Disconnect" type="logout" onClick={logout} />
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
