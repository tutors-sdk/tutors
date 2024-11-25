<script lang="ts">
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";
  import MenuItem from "../../support/MenuItem.svelte";

  import { PUBLIC_ANON_MODE } from "$env/static/public";
  import Menu from "$lib/ui/support/Menu.svelte";

  interface Props {
    redirect?: string;
  }
  let { redirect = "" }: Props = $props();
</script>

{#snippet menuSelector()}
  <div class="mt-2 flex items-center">
    <Avatar classes="size-9" src="/tutors-profile.png" name="Anonymous Tutors Profile" />
  </div>
{/snippet}

{#snippet menuContent()}
  <ul class="space-y-6">
    {#if PUBLIC_ANON_MODE !== "TRUE"}
      <MenuItem link="/auth{redirect}" text="Connect" type="github" />
      <MenuItem link="/" text="Home" type="tutors" />
    {/if}
  </ul>
{/snippet}

<Menu {menuSelector} {menuContent} />
