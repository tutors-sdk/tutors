<script lang="ts">
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import { presenceService } from "$lib/services/presence.svelte";
  import Icon from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
</script>

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
