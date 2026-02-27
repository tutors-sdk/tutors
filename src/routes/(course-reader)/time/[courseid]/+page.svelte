<script lang="ts">
  import { TutorsTime, type TutorsTimeStudent } from "@tutors/tutors-time-lib";
  import { currentCourse, tutorsId } from "$lib/runes.svelte";
  import HeatMaps from "./HeatMaps.svelte";
  import Tables from "./Tables.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";

  interface Props {
    data: any;
  }
  let { data }: Props = $props();

  let studentCalendar = $state<TutorsTimeStudent | null>(null);
  let isLoading = $state(false);

  // Reactive effect that reloads data when course or student changes
  $effect(() => {
    const courseId = currentCourse.value?.courseId;
    const studentLogin = tutorsId.value?.login;
    
    if (!courseId || !studentLogin) return;
    
    isLoading = true;
    TutorsTime.loadStudentTime(courseId, studentLogin, null, null)
      .then((data) => {
        studentCalendar = data;
      })
      .catch((error) => {
        console.error("Failed to load student calendar:", error);
      })
      .finally(() => {
        isLoading = false;
      });
  });
</script>

<svelte:head>
  <title>Student Calendar</title>
  <meta name="description" content="Single-student calendar view for a specific course" />
</svelte:head>    

<SecondaryNavigator lo={data?.lo} parentCourse={data.lo?.parentCourse?.properties?.parent} />
<div class="w-full">
  <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 mb-2 overflow-hidden rounded-xl border-[1px] p-4 mx-4 max-w-full mt-4">
    <HeatMaps {studentCalendar} />
  </div>
  <div class="border-primary-500 bg-surface-100 dark:bg-surface-900 mb-2 overflow-hidden rounded-xl border-[1px] p-4 mx-4 max-w-full">
    <Tables {studentCalendar} />
  </div>
</div>

