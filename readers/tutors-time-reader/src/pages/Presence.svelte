<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import { currentLo, currentUser } from "../stores";
  import type { StudentMetric, User } from "tutors-reader-lib/src/types/metrics-types";
  import StudentCard from "../components/cards/StudentCard.svelte";
  import { querystring } from "svelte-spa-router";
  import { PresenceService } from "../reader-lib/services/presence-service";
  import { MetricsService } from "../reader-lib/services/metrics-service";

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
    course = await cache.fetchCourse(params.wild);
    presenceService.setCourse(course);
    presenceService.start();
    // noinspection TypeScriptValidateTypes
    currentLo.set({
      title: `Tutors Live: ${course.lo.title}`,
      type: "tutorsLive",
      parentLo: course.lo,
      img: course.lo.img
    });
    title = `Tutors Live`;
    const user = await metricsService.fetchUserById(id);
    if (!user.onlineStatus) user.onlineStatus = "online"
    show = user.onlineStatus === "online"
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
  <div class="flex h-screen justify-center mt-28">
    <div class="text-center max-w-screen-md">

      <div class="flex flex-wrap shadow-md rounded-lg px-4 py-2 bg-base-200 text-base-content">
        <div class="flex justify-between w-full border-gray-400 border-b-2 p-2">
          <div class="font-sm font-light text-xl text-center">TutorsLive</div>
        </div>

        <div class="font-sm font-light text-l text-left p-2">
          <p class="p-2">
            In order to see who is online now, you will need to also share your presence.
            Check the "Share Presence" box on your course page.
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

