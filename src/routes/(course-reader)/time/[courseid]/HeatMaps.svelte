<script lang="ts">
  import CalendarHeatmap from "./CalendarHeatmap.svelte";
  import type { TutorsTimeStudent } from "@tutors/tutors-time-lib";

  interface Props {
    studentCalendar: TutorsTimeStudent | null;
  }

  let { studentCalendar }: Props = $props();
</script>

{#if studentCalendar && (studentCalendar.course?.dates?.length ?? 0) > 0}
  <section class="shrink-0 py-4 min-w-0 space-y-6 -mx-2 px-2 w-[calc(100%+1rem)]">
    <!-- Row 1: Calendar and Lab activity heatmaps -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {#if studentCalendar.calendarByDay}
        <div class="min-w-0 w-full overflow-hidden">
          <h2 class="text-2xl font-semibold mb-4">Calendar Activity </h2>
          <CalendarHeatmap
            calendarByDay={studentCalendar.calendarByDay}
            dates={studentCalendar.course?.dates ?? []}
            elementId="student-activity-heatmap"
          />
        </div>
      {/if}
      {#if studentCalendar.labsByDay}
        <div class="min-w-0 w-full overflow-hidden">
          <h2 class="text-2xl font-semibold mb-4">Lab Activity </h2>
          <CalendarHeatmap
            calendarByDay={studentCalendar.labsByDay}
            dates={studentCalendar.course?.dates ?? []}
            elementId="student-lab-heatmap"
          />
        </div>
      {/if}
    </div>

    <!-- Row 2: Course and Lab median heatmaps -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {#if studentCalendar.course?.calendarModel?.medianByDay?.row}
        <div class="min-w-0 w-full overflow-hidden">
          <h2 class="text-2xl font-semibold mb-4">Calendar Median Activity</h2>
          <CalendarHeatmap
            calendarByDay={studentCalendar.course?.calendarModel?.medianByDay?.row}
            dates={studentCalendar.course?.dates ?? []}
            elementId="course-median-heatmap"
          />
        </div>
      {/if}
      {#if studentCalendar.course?.labsMedianByDay}
        <div class="min-w-0 w-full overflow-hidden">
          <h2 class="text-2xl font-semibold mb-4">Lab Median Activity</h2>
          <CalendarHeatmap
            calendarByDay={studentCalendar.course?.labsMedianByDay}
            dates={studentCalendar.course?.dates ?? []}
            elementId="lab-median-heatmap"
          />
        </div>
      {/if}
    </div>
  </section>
{/if}

