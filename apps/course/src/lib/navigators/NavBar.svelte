<script lang="ts">
  import { courseUrl, currentCourse, calendarDrawer, infoDrawer, themeBuilderDrawer, tocDrawer } from "tutors-reader-lib/src/stores/stores";
  import { LayoutMenu, NavTitle, NavUser } from "tutors-ui";
  import Icon from "tutors-ui/lib/Atoms/Icon/Icon.svelte";
  import { AppBar, Divider } from "@skeletonlabs/skeleton";

  const infoDrawerOpen: any = () => {
    infoDrawer.set(true);
  };
  const calendarDrawerOpen: any = () => {
    calendarDrawer.set(true);
  };
  const tocDrawerOpen: any = () => {
    tocDrawer.set(true);
  };
</script>

<AppBar class="h-24 space-x-1 lg:space-x-4">
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
      <div class="mx-auto inline-flex rounded-lg bg-surface-200 p-2 dark:bg-surface-700">
        <div class="pr-4 pl-2">
          <div class="pt-1 text-sm">Current Week</div>
          <div class="text-l pb-1 text-center font-bold">{$currentCourse.currentWeek.title}</div>
        </div>

        <Divider vertical="{true}" borderWidth="border-l" />
        <button class="btn btn-sm" on:click="{calendarDrawerOpen}">
          <Icon type="calendar" />
          <span class="text-sm font-bold">Calendar</span>
        </button>
      </div>
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
