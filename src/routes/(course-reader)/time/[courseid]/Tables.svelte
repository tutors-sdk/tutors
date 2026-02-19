<script lang="ts">
  import type { TutorsTimeStudent } from "@tutors/tutors-time-lib";
  import StudentCalendarTable from "./StudentCalendarTable.svelte";
  import CalendarByDayTable from "./CalendarByDayTable.svelte";
  import StudentLabTable from "./StudentLabTable.svelte";
  import LabByStepTable from "./LabByStepTable.svelte";

  interface Props {
    studentCalendar: TutorsTimeStudent | null;
  }

  let { studentCalendar }: Props = $props();
</script>

<div class="card p-4 flex flex-col min-w-0 shrink-0">
  <div class="flex flex-col gap-6">
    {#if studentCalendar}
      <div class="flex flex-col gap-6">
        <StudentCalendarTable
          courseid={studentCalendar.courseid}
          studentid={studentCalendar.studentid}
          calendarByWeek={studentCalendar.calendarByWeek}
          medianRow={studentCalendar.course?.calendarModel?.medianByWeek?.row ?? null}
          weeks={studentCalendar.course?.weeks ?? []}
        />
        <CalendarByDayTable
          courseid={studentCalendar.courseid}
          studentid={studentCalendar.studentid}
          calendarByDay={studentCalendar.calendarByDay}
          medianRow={studentCalendar.course?.calendarModel?.medianByDay?.row ?? null}
          dates={studentCalendar.course?.dates ?? []}
        />
        <StudentLabTable
          courseid={studentCalendar.courseid}
          studentid={studentCalendar.studentid}
          studentLabRow={studentCalendar.labsByLab}
          labMedianRow={studentCalendar.course?.labsModel?.medianByLab?.row ?? null}
          labColumns={studentCalendar.course?.labColumns ?? []}
        />
        <LabByStepTable
          courseid={studentCalendar.courseid}
          studentid={studentCalendar.studentid}
          labsByStep={studentCalendar.labsByStep}
          medianRow={studentCalendar.course?.labsModel?.medianByLabStep?.row ?? null}
          stepColumns={studentCalendar.course?.stepColumns ?? []}
        />
      </div>
    {/if}
  </div>
</div>

