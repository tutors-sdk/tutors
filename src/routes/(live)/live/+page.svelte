<script lang="ts">
  import { liveService } from "$lib/services/live.svelte";
  import Courses from "$lib/ui/time/Courses.svelte";
  import CoursesGroup from "$lib/ui/time/CoursesGroup.svelte";
  import Students from "$lib/ui/time/Students.svelte";
  import { Tabs } from "@skeletonlabs/skeleton-svelte";

  let group = $state("courses");

  liveService.startGlobalPresenceService();
</script>

<Tabs bind:value={group} listJustify="justify-center">
  {#snippet list()}
    <Tabs.Control value="courses">Courses</Tabs.Control>
    <Tabs.Control value="students">Students</Tabs.Control>
    <Tabs.Control value="groups">Groups</Tabs.Control>
  {/snippet}
  {#snippet content()}
    <Tabs.Panel value="courses"><Courses /></Tabs.Panel>
    <Tabs.Panel value="students"><Students /></Tabs.Panel>
    <Tabs.Panel value="groups"><CoursesGroup /></Tabs.Panel>
  {/snippet}
</Tabs>
