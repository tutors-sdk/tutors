<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import { currentLo, currentUser } from "../stores";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import StudentCard from "../components/cards/StudentCard.svelte";
  import { querystring } from "svelte-spa-router";
  import { PresenceService } from "../reader-lib/services/presence-service";
  import type { MetricsService } from "../reader-lib/services/metrics-service";

  let students: StudentMetric[] = [];
  export let params: any = {};
  const cache: CourseService = getContext("cache");
  const metricsService: MetricsService = getContext("metrics");
  const presenceService = new PresenceService(metricsService, students, refresh, refreshStatus);
  let course = cache.course;
  let title = "";
  let status = false;
  let thisUser: User = null;
  let thisUserNickName = "";
  let show = true;

  function refresh(refreshedStudents: StudentMetric[]) {
    students = [...refreshedStudents];
  }

  function refreshStatus(user: User) {
    if (user.nickname === thisUserNickName) {
      if (!user.hasOwnProperty("onlineStatus")) user.onlineStatus = "online";
      show = user.onlineStatus === "online";
    }
  }

  async function getCourse(url) {
    let id = $querystring;
    course = await cache.readCourse(params.wild);
    presenceService.setCourse(course);
    presenceService.start();
    // noinspection TypeScriptValidateTypes
    currentLo.set({
      title: `Tutors Live: ${course.lo.title}`,
      type: "tutorsLive",
      parentLo: course.lo,
      img: course.lo.img,
    });
    title = `Tutors Live`;
    const user = await metricsService.fetchUserById(id);
    if (!user.onlineStatus) user.onlineStatus = "online";
    show = user.onlineStatus === "online";
    currentUser.set(user);
    thisUserNickName = user.nickname;
    status = user.onlineStatus === "offline";
    return course;
  }

  onDestroy(async () => {
    presenceService.stop();
  });
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if show}
  {#await getCourse(params.wild) then course}
    <div class="container mx-auto mt-4 mb-4 h-screen">
      <div class="col-span-6 wall-bg">
        {#each students as student}
          <StudentCard {student} />
        {/each}
      </div>
    </div>
  {/await}
{:else}
  <div class="mt-28 flex h-screen justify-center">
    <div class="max-w-screen-md text-center">
      <div class="flex flex-wrap rounded-lg bg-base-200 px-4 py-2 text-base-content shadow-md">
        <div class="flex w-full justify-between border-b-2 border-gray-400 p-2">
          <div class="font-sm text-center text-xl font-light">TutorsLive</div>
        </div>

        <div class="font-sm text-l p-2 text-left font-light">
          <p class="p-2">
            In order to see who is online now, you will need to also share your presence. Check the "Share Presence" box on your course
            page.
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
