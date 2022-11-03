<script lang="ts">
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { Calendar, WeekType } from "tutors-reader-lib/src/types/lo-types";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import { calendarDrawer } from "tutors-reader-lib/src/stores/stores";

  let course: Course = null;
  const cache: CourseService = getContext("cache");
  let title = "";
  let calendar: Calendar;
  let currentWeek: WeekType;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let display = false;
  beforeUpdate(() => {
    course = cache.course;
    if (course) {
      display = true;
      title = course.lo.title;
      calendar = course.calendar;
      currentWeek = course.currentWeek;
    }
  });

  const drawerClose: any = () => {
    calendarDrawer.set(false);
  };
</script>

<div class="mt-4 mr-4 text-right">
  <button class="btn btn-icon bg-primary-500 text-white" on:click={drawerClose}><span class="font-bold">X</span></button>
</div>
<div class="px-12 py-4">
  <h4 class="mb-4 text-center font-semibold">{calendar.title} : {title}</h4>
  <table class="w-full table-auto">
    <thead>
      <tr>
        <th class="mb-1 text-center">Week No.</th>
        <th class="mb-1 text-center">Type</th>
        <th class="mb-1 text-center">Date Starts</th>
      </tr>
    </thead>
    <tbody class="text-center">
      {#each calendar.weeks as week}
        {#if currentWeek.title == week.title}
          <tr class="my-2 bg-accent-300 dark:bg-accent-700">
            <td>{week.title}</td>
            <td>{week.type}</td>
            <td>{monthNames[week.dateObj.getMonth()]} {week.dateObj.getDate()}</td>
          </tr>
        {:else}
          <tr class="hover my-2">
            <td>{week.title}</td>
            <td>{week.type}</td>
            <td>{monthNames[week.dateObj.getMonth()]} {week.dateObj.getDate()}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
