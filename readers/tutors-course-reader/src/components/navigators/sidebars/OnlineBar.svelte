<script lang="ts">
  import { currentCourse, currentUser, revealOnline, studentsOnline } from "../../../stores";
  import { beforeUpdate, getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { CourseService } from "../../../reader-lib/services/course-service";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import { PresenceService } from "../../../reader-lib/services/presence-service";
  import { MetricsService } from "../../../reader-lib/services/metrics-service";
  import SidebarComponent from "./SidebarComponent.svelte";
  import StudentCard from "../../cards/StudentCard.svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";

  let user: User;
  let course: Course = null;
  let status = false;
  let lastCourse: Course = null;
  const cache: CourseService = getContext("cache");

  const metricsService = getContext("metrics");
  let onlineStudents = 0;
  let students: StudentMetric[] = [];
  let presenceService: PresenceService = null;

  function refresh(refreshedStudents: StudentMetric[]) {
    onlineStudents = refreshedStudents.length;
    students = [...refreshedStudents];
    studentsOnline.set(onlineStudents);
  }

  currentUser.subscribe(async (newUser) => {
    user = newUser;
    let course = await $currentCourse;
    if (course && isAuthenticated()) {
      metricsService.setCourse(course);
      if (user && !user.hasOwnProperty("onlineStatus")) {
        user.onlineStatus = "online";
      } else {
        if (user) status = user.onlineStatus === "online";
      }
      presenceService = new PresenceService(new MetricsService(), students, refresh, null);
      lastCourse = course;
      presenceService.setCourse(course);
      presenceService.start();
    }
  });

  let display = false;
  beforeUpdate(() => {
    course = cache.course;
    if (course) {
      display = true;
    }
  });
</script>

{#if $revealOnline && display}
  <SidebarComponent title="Online Students" show={revealOnline} origin="right-0">
    <div class="flex flex-wrap">
      {#if onlineStudents < 1}
        <span class="text-lg">No students currently online...</span>
      {/if}
      {#each students as student}
        <StudentCard {student} />
      {/each}
    </div>
  </SidebarComponent>
{/if}
