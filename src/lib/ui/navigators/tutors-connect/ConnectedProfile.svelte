<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { presenceService } from "$lib/services/presence.svelte";

  import { Popover } from "@skeletonlabs/skeleton-svelte";
  import ConnectedIcon from "./ConnectedIcon.svelte";
  import MenuItem from "./MenuItem.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

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
  contentBase="card bg-surface-50 m-4 space-y-4 max-w-[320px] z-[100"
>
  {#snippet trigger()}
    <ConnectedIcon />
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 space-y-4 bg-gray-100 p-4 shadow-lg dark:bg-gray-800">
      <ul class="space-y-6">
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
          <li class="flex items-center">
            <Icon type="live" />
            <div class="ml-2">
              View <span class="badge bg-error-500 text-white">{presenceService.studentsOnline.value.length}</span> Online
            </div>
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
    </nav>
  {/snippet}
</Popover>
