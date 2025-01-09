<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect";
  import { presenceService } from "$lib/services/community";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";
  import Menu from "$lib/ui/components/Menu.svelte";
  import OnlineButton from "../buttons/OnlineButton.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";

  function logout() {
    tutorsConnectService.disconnect("/");
  }

  function shareStatusChange() {
    tutorsConnectService.toggleShare();
  }
</script>

{#snippet menuSelector()}
  <div class="relative">
    {#if presenceService.studentsOnline.value.length && tutorsId.value?.share}
      <span class="variant-filled-error badge-icon absolute -right-2 -top-2 z-10 text-white">
        {presenceService.studentsOnline.value.length}
      </span>
    {/if}
    <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
      {#if tutorsId.value?.share === "true"}
        <Icon icon="fluent:presence-available-24-filled" color="rgba(var(--color-success-500))" height="20" />
      {:else}
        <Icon icon="fluent:presence-available-24-regular" color="rgba(var(--color-error-500))" height="20" />
      {/if}
    </span>
    <div class="mt-2 flex items-center">
      <img class="w-12 rounded-full" src={tutorsId.value?.image} alt={tutorsId.value?.name} />
    </div>
  </div>
{/snippet}

{#snippet menuContent()}
  <ul class="mt-12 space-y-2">
    {#if currentCourse.value}
      {#if tutorsId.value?.share === "true"}
        <MenuItem text="Share Presence" type="online" onClick={shareStatusChange} />
      {:else}
        <MenuItem text="Share Presence" type="offline" onClick={shareStatusChange} />
      {/if}
      {#if tutorsId.value?.share === "true"}
        <MenuItem
          link="https://time.tutors.dev/{currentCourse.value?.courseId}"
          text="Tutors Time"
          type="tutorsTime"
          targetStr="_blank"
        />
        <MenuItem link="/live/{currentCourse.value?.courseId}" text="Tutors Live" type="live" />

        <li class="option !p-0 hover:preset-tonal">
          <OnlineButton />
        </li>

        <hr />
      {/if}
    {/if}
    <MenuItem link="/" text="Dashboard" type="tutors" />
    <MenuItem
      link="https://github.com/{tutorsId.value?.login}"
      text="Github Profile"
      type="github"
      targetStr="_blank"
    />
    <MenuItem text="Disconnect" type="logout" onClick={logout} />
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
