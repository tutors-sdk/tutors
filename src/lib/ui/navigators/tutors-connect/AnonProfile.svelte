<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton-svelte";
  import MenuItem from "$lib/ui/components/MenuItem.svelte";

  import { PUBLIC_ANON_MODE } from "$env/static/public";
  import Menu from "$lib/ui/components/Menu.svelte";

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
