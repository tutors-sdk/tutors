<script lang="ts">
  import { liveService } from "$lib/services/community";
  import Courses from "$lib/ui/time/Courses.svelte";
  import CoursesGroup from "$lib/ui/time/CoursesGroup.svelte";
  import Students from "$lib/ui/time/Students.svelte";
  import { Tabs } from "@skeletonlabs/skeleton-svelte";

  let group = $state("courses");

  liveService.startGlobalPresenceService();
</script>

<Tabs defaultValue="Courses">
  <Tabs.List>
    <Tabs.Trigger value="Courses">Courses ({liveService.coursesOnline.value.length})</Tabs.Trigger>
    <Tabs.Trigger value="Students">Students ({liveService.studentsOnline.value.length})</Tabs.Trigger>
    <Tabs.Trigger value="Groups">Groups</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
    <Tabs.Content value="Courses"><Courses /></Tabs.Content>
    <Tabs.Content value="Students"><Students /></Tabs.Content>
    <Tabs.Content value="Groups"><CoursesGroup /></Tabs.Content>
</Tabs>

