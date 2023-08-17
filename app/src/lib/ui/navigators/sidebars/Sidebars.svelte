<script lang="ts">
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import InfoBar from "./InfoBar.svelte";
  import TocBar from "./TocBar.svelte";
  import OnlineBar from "./OnlineBar.svelte";
  import ThemeBuilderBar from "./ThemeBuilderBar.svelte";
  import CalendarBar from "./CalendarBar.svelte";
</script>

<Drawer width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" class="z-50">
  {#if $drawerStore.id === "info"}
    <InfoBar />
  {:else if $drawerStore.id === "calendar"}
    <CalendarBar />
  {:else if $drawerStore.id === "toc"}
    <TocBar />
  {:else if $drawerStore.id === "online"}
    <OnlineBar />
  {:else if $drawerStore.id === "theme"}
    <ThemeBuilderBar />
  {/if}
</Drawer>
