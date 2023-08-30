<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Avatar } from "@skeletonlabs/skeleton";
  export let avatar: string = "";
  export let name: string = "";
  export let onlineStatus: boolean | undefined = undefined;
  export let usersOnline: string = "";
</script>

<button class="btn btn-sm space-x-1">
  <div class="relative inline-block">
    {#if usersOnline}
      <span class="badge-icon variant-filled-error absolute -top-2 -right-2 z-10 text-white">
        {usersOnline}
      </span>
      <span class="badge-icon absolute -bottom-2 -right-2 z-10 text-white">
        {#if onlineStatus === true}
          <Icon
            icon="fluent:presence-available-24-filled"
            color="rgba(var(--color-success-500))"
            height="20"
          />
        {:else if onlineStatus === false}
          <Icon
            icon="fluent:presence-available-24-regular"
            color="rgba(var(--color-error-500))"
            height="20"
          />
        {/if}
      </span>
    {/if}
    <Avatar width="w-10" src={avatar} alt={name} />
  </div>
</button>
