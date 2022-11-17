<script lang="ts">
  import { LayoutMenu, NavTimeUser } from "tutors-ui";
  import { AppBar, Divider } from "@brainandbones/skeleton";
  import TutorsIcon from "./TutorsIcon.svelte";

  export let title = "Tutors Time";
  export let subTitle = "";
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
          <p class="text-sm font-bold">{subTitle}</p>
        </div>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <div class="flex items-center space-x-1 lg:space-x-4">
      <LayoutMenu />
      <Divider vertical={true} borderWidth="border-l" class="hidden lg:block" />
      <NavTimeUser />
    </div>
  </svelte:fragment>
</AppBar>
