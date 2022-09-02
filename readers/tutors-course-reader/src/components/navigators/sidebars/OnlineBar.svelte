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

  const cache: CourseService = getContext("cache");
  const metricsService :MetricsService = getContext("metrics");
  let students: StudentMetric[] = [];
  let presenceService: PresenceService = null;
  let lastCourse:Course = null;
  let user: User;

  function refresh(refreshedStudents: StudentMetric[]) {
    let student = refreshedStudents.find(student => student.nickname === user.nickname);
    let index = refreshedStudents.indexOf(student);
    if (index !== -1) {
      refreshedStudents.splice(index, 1);
    }
    students = [...refreshedStudents];
    studentsOnline.set(refreshedStudents.length);
  }

  function initService(course: Course) {
    if (presenceService) presenceService.stop();
    metricsService.setCourse(course);
    presenceService = new PresenceService(metricsService, students, refresh, null);
    presenceService.setCourse(course);
    presenceService.start();
    students = [];
    studentsOnline.set(0);
  }
  
  currentCourse.subscribe(async (newCourse: Course) => {
    if (newCourse && newCourse != lastCourse) {
      lastCourse = newCourse;
      if (isAuthenticated() && newCourse?.authLevel > 0) {
        initService(newCourse);
      }
    }
  });

  currentUser.subscribe(async (newUser) => {
    user = newUser;
  });
</script>

{#if $revealOnline}
  <SidebarComponent title="Online Students" show={revealOnline} origin="right-0">
    <div class="flex flex-wrap">
      {#if $studentsOnline == 0}
        <span class="text-lg">No students currently online...</span>
      {/if}
      {#each students as student}
        <StudentCard {student} />
      {/each}
    </div>
  </SidebarComponent>
{/if}
