<script lang="ts">
  import { courseUrl, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { NavTitle } from "tutors-ui";
  import Icon from "tutors-ui/lib/Atoms/Icon/Icon.svelte";
  import { AppBar, Divider, drawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
  import LayoutMenu from "./LayoutMenu.svelte";
    import NavUser from "./NavUser.svelte";

  const infoDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "info", position: "left" };
    drawerStore.open(settings);
  };
  const calendarDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "calendar", position: "left" };
    drawerStore.open(settings);
  };
  const tocDrawerOpen: any = () => {
    const settings: DrawerSettings = { id: "toc", position: "right" };
    drawerStore.open(settings);
  };
</script>

<AppBar class="h-24 space-x-1 lg:space-x-4 shadow-none border-b-[1px] border-surface-200-700-token">
  <svelte:fragment slot="lead">
    <div class="flex items-center">
      {#if $currentCourse?.lo.contentMd}
        <button class="btn btn-sm" on:click="{infoDrawerOpen}">
          <Icon type="courseinfo" />
        </button>
      {/if}
      <NavTitle />
    </div>
  </svelte:fragment>
  {#if $currentCourse?.currentWeek}
    <div class="hidden w-full lg:flex">
      <button class="mx-auto inline-flex rounded-lg bg-surface-200-700-token p-2 border-[1px] border-surface-300-600-token"  on:click="{calendarDrawerOpen}">
        <div class="my-auto pl-2 pr-4">
          <Icon type="calendar" />
        </div>
        <Divider vertical="{true}" borderWidth="border-l" />
        <div class="px-2">
          <div class="pt-1 text-sm">Current Week</div>
          <div class="text-l pb-1 font-bold">{$currentCourse.currentWeek.title}</div>
        </div>
      </button>
    </div>
  {/if}
  <svelte:fragment slot="trail">
    <div class="flex items-center space-x-1 lg:space-x-4">
      {#if !$currentCourse?.isPortfolio()}
        <a class="btn btn-sm" href="/search/{$courseUrl}"
          ><Icon type="search" />
          <span class="hidden text-sm font-bold lg:block">Search</span>
        </a>
        <Divider vertical="{true}" borderWidth="border-l" class="hidden lg:block" />
      {/if}
      <LayoutMenu />
      <Divider vertical="{true}" borderWidth="border-l" class="hidden lg:block" />
      <NavUser />
      <button class="btn btn-sm" on:click="{tocDrawerOpen}">
        <Icon type="toc" />
      </button>
    </div>
  </svelte:fragment>
</AppBar>
