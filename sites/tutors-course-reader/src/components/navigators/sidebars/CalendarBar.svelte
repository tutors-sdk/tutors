<script lang="ts">
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { Calendar, WeekType } from "tutors-reader-lib/src/types/lo-types";
  import type { CourseService } from "../../../reader-lib/services/course-service";
  import { calendarDrawer } from "../../../stores";

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


  const drawerClose: any = () => { calendarDrawer.set(false) };
</script>

<div class="text-right mt-4 mr-4">
  <button class="btn btn-square bg-primary-500" on:click={drawerClose}>X</button>
  </div>
  <div class="px-12 py-4">
    <h4 class="text-center font-semibold mb-4">{calendar.title} : {title} </h4>
    <table class="table-auto w-full">
      <thead
        >
        <tr>
          <th class="text-center mb-1">Week No.</th>
          <th class="text-center mb-1">Type</th>
          <th class="text-center mb-1">Date Starts</th>
        </tr>
      </thead>
      <tbody class="text-center">
        {#each calendar.weeks as week}
          {#if currentWeek.title == week.title}
            <tr class="bg-surface-50-900-token my-2">
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
    