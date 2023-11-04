<script lang="ts">
  import { Drawer, getDrawerStore } from "@skeletonlabs/skeleton";
  import Sidebar from "./Sidebar.svelte";
  import { currentCourse } from "$lib/stores";
  import Calendar from "../../learning-objects/content/Calendar.svelte";
  import CourseContext from "../../learning-objects/structure/CourseContext.svelte";
  import CoursePresence from "$lib/ui/time/CoursePresence.svelte";
  const drawerStore = getDrawerStore();
</script>

<Drawer width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" class="z-50">
  {#if $drawerStore.id === "info"}
    <Sidebar>
      <prose class="prose dark:prose-invert">
        {@html $currentCourse?.contentHtml}
      </prose>
    </Sidebar>
  {:else if $drawerStore.id === "calendar"}
    <Sidebar>
      <Calendar calendar={$currentCourse?.courseCalendar} />
    </Sidebar>
  {:else if $drawerStore.id === "toc"}
    <Sidebar>
      <CourseContext course={$currentCourse} />
    </Sidebar>
  {:else if $drawerStore.id === "online"}
    <Sidebar>
      <CoursePresence />
    </Sidebar>
  {/if}
</Drawer>
