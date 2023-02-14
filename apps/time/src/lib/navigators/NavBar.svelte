<script lang="ts">
  import { Metric } from "tutors-ui";
  import { AppBar } from "@skeletonlabs/skeleton";
  import TutorsIcon from "./TutorsIcon.svelte";
  import NavTimeUser from "./NavTimeUser.svelte";
  import LayoutMenu from "./LayoutMenu.svelte";

  export let title = "Tutors Time";
  export let subTitle = "";
  export let modules = 0;
  export let visits = 0;
  export let users = 0;
</script>

<AppBar class="h-24 space-x-1 lg:space-x-4">
  <svelte:fragment slot="lead">
    <div class="flex items-center">
      <div class="flex-1">
        <div class="inline-flex">
          <TutorsIcon />
        </div>
      </div>
      <div class="ml-4 flex-nowrap">
        <h2 class="mr-4 hidden text-sm font-bold sm:text-lg md:inline-block">{title}</h2>
        <!-- Badge -->
        <div class="hidden md:block" target="_blank">
          <span class="text-xs">{subTitle}</span>
        </div>
      </div>
    </div>
  </svelte:fragment>
  <div class="hidden md:inline-block">
    <Metric value="{modules}" title="Active Modules" />
    <!-- <Metric value="{visits}" title="Page Loads" /> -->
    <Metric value="{users}" title="Students Online" />
  </div>
  <svelte:fragment slot="trail">
    <div class="flex items-center space-x-1 lg:space-x-4">
      <LayoutMenu />
      <span class="divider-vertical h-10 hidden lg:block"></span>
      <NavTimeUser />
    </div>
  </svelte:fragment>
</AppBar>
