<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton";
  export let avatar: string = "";
  export let name: string = "";
  export let onlineStatus: boolean;
  export let usersOnline: string = "0";
  export let usePopupFunction: { event: any; target: any };
</script>

<button class="btn btn-sm space-x-1">
  <div class="relative inline-block">
    {#if usersOnline}
      <span class="badge-icon variant-filled-error absolute -top-2 -right-2 z-10 text-white">
        {usersOnline}
      </span>
    {/if}
    <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
      {#if onlineStatus}
        <Icon
          icon="fluent:presence-available-24-filled"
          color="rgba(var(--color-success-500))"
          height="20"
        />
      {/if}
      {#if !onlineStatus}
        <Icon
          icon="fluent:presence-available-24-regular"
          color="rgba(var(--color-error-500))"
          height="20"
        />
      {/if}
    </span>
    <Avatar width="w-10" src={avatar} alt={name} />
  </div>
</button>
