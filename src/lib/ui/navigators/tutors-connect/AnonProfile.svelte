<script lang="ts">
  import { Avatar, Popover } from "@skeletonlabs/skeleton-svelte";
  import { setTheme } from "$lib/ui/themes/styles/icon-lib.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

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
  triggerBase="btn preset-tonal"
  contentBase="card bg-surface-50 m-4space-y-4 max-w-[320px] z-[100"
>
  {#snippet trigger()}
    <Avatar size="size-10" src="/tutors-profile.png" name="Anonymous Tutors Profile" />
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 space-y-4 bg-gray-100 p-4 shadow-lg dark:bg-gray-800" data-popup="design">
      <ul class="space-y-6">
        {#if PUBLIC_ANON_MODE !== "TRUE"}
          <li class="option !p-0v hover:preset-tonal">
            <a href="/auth{redirect}" class="flex items-center">
              <Icon icon="mdi:github" height="25" />
              <span class="ml-2 text-base">Connect</span>
            </a>
          </li>
          <li class="option !p-0 hover:preset-tonal">
            <a href="/" class="flex items-center">
              <Icon icon="fluent:home-24-filled" color="rgba(var(--color-primary-500))" height="20" />
              <div class="ml-2">Home</div>
            </a>
          </li>
        {/if}
      </ul>
    </nav>
  {/snippet}
</Popover>
