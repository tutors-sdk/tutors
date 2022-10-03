<script lang="ts">
  import { currentCourse, revealCalendar } from "../../../stores";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import Icon from "tutors-reader-lib/src/iconography/Icon.svelte";

  let bgColour = "bg-base-100";
  let textColour = "text-white";
  let course: Course;

  currentCourse.subscribe((current) => {
    course = current;
    switch (course?.currentWeek?.type) {
      case "tuition":
        textColour = "white";
        bgColour = "bg-warning";
        break;
      case "reading":
        textColour = "white";
        bgColour = "bg-info";
        break;
      default:
        bgColour = "bg-warning";
    }
  });
</script>

{#if $currentCourse.currentWeek}
  <button on:click={() => revealCalendar.set(true)}>
    <Icon type="calendar" toolTip="Full Calendar" button={true} tipPos="tooltip-bottom" />
  </button>
  <div class="calendar {textColour} {bgColour}">
    <div class="pt-1  text-sm">Current Week</div>
    <div class="text-l pb-1">{$currentCourse.currentWeek.title}</div>
  </div>
{/if}
