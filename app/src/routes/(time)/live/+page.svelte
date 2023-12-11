<script lang="ts">
  import "../../../app.postcss";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { presenceService } from "$lib/services/presence";
  import { dataGeneratorService } from "$lib/services/data-generator";
  import AllCoursePresence from "$lib/ui/time/AllCoursePresence.svelte";
  import { allStudentsOnline, coursesOnline } from "$lib/stores";
  import Metric from "$lib/ui/time/Metric.svelte";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import AllStudentPresence from "$lib/ui/time/AllStudentPresence.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let listByCourse = false;
  let listModeStr = "List By Student";
  function switchMode() {
    listByCourse = !listByCourse;
    if (listByCourse) {
      listModeStr = "List By Course";
    } else {
      listModeStr = "List By Student";
    }
  }

  dataGeneratorService.startDataGeneratorService();
</script>

<TutorsShell {session} {supabase} title="Tutors Live Stream">
  <div slot="header" class="hidden md:inline-block w-full">
    <div class="flex justify-end">
      <SlideToggle on:click={switchMode} name="slider-label" background="bg-surface-300 dark:bg-surface-700">{listModeStr}</SlideToggle>
      <Metric value={$coursesOnline} title="Active Modules" />
      <Metric value={$allStudentsOnline} title="Active Students" />
    </div>
  </div>
  {#if listByCourse}
    <AllCoursePresence />
  {:else}
    <AllStudentPresence />
  {/if}
</TutorsShell>
