<script lang="ts">
  import { currentCourse, currentUser, onlineDrawer, studentsOnline, studentsOnlineList } from "../../../stores";
  import { getContext } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import type { MetricsService } from "../../../reader-lib/services/metrics-service";
  import { PresenceService } from "../../../reader-lib/services/presence-service";
  import StudentCard from "../../cards/StudentCard.svelte";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";

  const metricsService: MetricsService = getContext("metrics");
  let students: StudentMetric[] = [];
  let presenceService: PresenceService = null;
  let lastCourse: Course = null;
  let user: User;

  function refresh(refreshedStudents: StudentMetric[]) {
    let student = refreshedStudents.find((student) => student.nickname === user.nickname);
    let index = refreshedStudents.indexOf(student);
    if (index !== -1) {
      refreshedStudents.splice(index, 1);
    }
    studentsOnlineList.set([...refreshedStudents]);
    studentsOnline.set(refreshedStudents.length);
  }

  async function initService(course: Course) {
    if (presenceService) {
      await presenceService.start();
    }else {
      metricsService.setCourse(course);
      presenceService = new PresenceService(metricsService, students, refresh, null);
      presenceService.setCourse(course);
      await presenceService.start();
      studentsOnlineList.set([]);
      studentsOnline.set(0);
    }
  }

  currentCourse.subscribe((newCourse: Course) => {
    if (newCourse && newCourse != lastCourse) {
      lastCourse = newCourse;
      if (isAuthenticated() && newCourse?.authLevel > 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        initService(newCourse);
      }
    }
  });

  currentUser.subscribe((newUser) => {
    user = newUser;
  });
  
  const drawerClose: any = () => { onlineDrawer.set(false) };
</script>
<div class="text-right mt-4 mr-4">
<button class="btn btn-square bg-primary-500" on:click={drawerClose}>X</button>
</div>
<div class="px-12 py-4">
  <div class="flex flex-wrap">
    {#if $studentsOnline == 0}
      <span class="text-lg">No students currently online...</span>
    {/if}
    {#each $studentsOnlineList as student}
      <StudentCard {student} />
    {/each}
  </div>
</div>
