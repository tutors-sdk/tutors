<script lang="ts">
  import { AppBar } from "@skeletonlabs/skeleton-svelte";
  import LayoutMenu from "$lib/ui/themes/menu/LayoutMenu.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import ConnectedProfile from "./tutors-connect/ConnectedProfile.svelte";
  import { tutorsConnectService } from "$lib/services/connect.svelte";
  import AnonProfile from "./tutors-connect/AnonProfile.svelte";

  interface Props {
    title?: string;
    subTitle?: string;
    header?: import("svelte").Snippet;
  }
  let { title = "Tutors Open Source Project", subTitle = "Open Web Learning Components", header }: Props = $props();
</script>

<AppBar
  shadow="none"
  classes="bg-surface-100 dark:bg-surface-950 h-14 justify-center border-surface-200 dark:border-surface-700"
>
  {#snippet lead()}
    <TutorsTitle {title} subtitle={subTitle} />
  {/snippet}
  {@render header?.()}
  {#snippet trail()}
    <span class="divider-vertical hidden h-10 lg:block"></span>
    <LayoutMenu />
    <span class="divider-vertical hidden h-10 lg:block"></span>
    <div class="relative">
      {#if tutorsConnectService.tutorsId.value?.login}
        <ConnectedProfile />
      {:else}
        <AnonProfile redirect="/" />
      {/if}
    </div>
    <span class="divider-vertical hidden h-10 lg:block"></span>
  {/snippet}
</AppBar>
