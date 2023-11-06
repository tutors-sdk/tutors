<script lang="ts">
  import "../../../app.postcss";
  import TutorsShell from "$lib/ui/app-shells/TutorsShell.svelte";
  import { presenceService } from "$lib/services/presence";
  import AllCoursePresence from "$lib/ui/time/AllCoursePresence.svelte";
  import { allStudentsOnline, coursesOnline } from "$lib/stores";
  import Metric from "$lib/ui/time/Metric.svelte";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import AllStudentPresence from "$lib/ui/time/AllStudentPresence.svelte";

  export let data: any;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  let listByCourse = true;
  let listModeStr = "List By Course";
  function switchMode() {
    listByCourse = !listByCourse;
    if (listByCourse) {
      listModeStr = "List By Course";
    } else {
      listModeStr = "List By Student";
    }
  }

  presenceService.startGlobalPresenceService();
</script>

<TutorsShell {session} {supabase} title="Tutors Live Stream">
  <div slot="header" class="hidden md:inline-block w-full">
    <div class="flex justify-end">
      <Metric value={$coursesOnline} title="Active Modules" />
      <Metric value={$allStudentsOnline} title="Active Students" />
      <SlideToggle on:click={switchMode} name="slider-label" checked>{listModeStr}</SlideToggle>
    </div>
  </div>
  {#if listByCourse}
    <AllCoursePresence />
  {:else}
    <AllStudentPresence />
  {/if}
</TutorsShell>
