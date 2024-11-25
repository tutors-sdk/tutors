<script lang="ts">
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";
  import { setTheme } from "$lib/ui/themes/styles/icon-lib.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import MenuItem from "./MenuItem.svelte";

  import { PUBLIC_ANON_MODE } from "$env/static/public";

  interface Props {
    redirect?: string;
  }
  let { redirect = "" }: Props = $props();
  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }

  function changeTheme(theme: string): void {
    setTheme(theme);
  }
</script>

<Popover
  bind:open={openState}
  positioning={{ placement: "top" }}
  triggerBase="btn"
  contentBase="card bg-surface-50 m-4space-y-4 max-w-[320px] z-[100]"
>
  {#snippet trigger()}
    <div class="mt-2 flex items-center">
      <Avatar classes="size-9" src="/tutors-profile.png" name="Anonymous Tutors Profile" />
    </div>
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 space-y-4 bg-gray-100 p-4 shadow-lg dark:bg-gray-800">
      <ul class="space-y-6">
        {#if PUBLIC_ANON_MODE !== "TRUE"}
          <MenuItem link="/auth{redirect}" text="Connect" type="github" />
          <MenuItem link="/" text="Home" type="tutors" />
        {/if}
      </ul>
    </nav>
  {/snippet}
</Popover>
