<script lang="ts">
  import "../../../app.postcss";
  import { AppShell } from "@skeletonlabs/skeleton";
  import HomeFooter from "$lib/ui/navigators/footers/HomeFooter.svelte";
  import LayoutMenu from "$lib/ui/navigators/menus/LayoutMenu.svelte";
  import MainNavigator from "$lib/ui/navigators/MainNavigator.svelte";
  import TutorsTitle from "$lib/ui/navigators/titles/TutorsTitle.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import { getCourseSummary, type CourseSummary } from "$lib/services/utils/course";
  import CourseCard from "$lib/ui/learning-objects/layout/CourseCard.svelte";
  import Metric from "$lib/ui/icons/Metric.svelte";
  const db = getDatabase();

  export let data: PageData;

  let los: CourseSummary[] = [];
  let courses = new Map<string, CourseSummary>();
  let modules = 0;
  let title = "Tutors Module Activity";
  let subTitle = "Connecting to Tutors Store...";
  let activeSince = "";
  let visits = 0;
  const tutorsTimeIds = new Set<string>();
  let users = 0;

  let countDown = 10;
  let canUpdate = false;
  let timer = setInterval(function () {
    activeSince = new Date().toLocaleTimeString();
    subTitle = `Please standby, Will be connected in ${countDown} seconds`;
    countDown--;
    if (countDown == 0) {
      clearInterval(timer);
      activeSince = new Date().toLocaleTimeString();
      subTitle = `Connected at : ${activeSince}`;
      canUpdate = true;
    }
  }, 1000);

  function updateNmrUsers(courseSummary: CourseSummary) {
    if (courseSummary.currentLo.tutorsTimeId) {
      tutorsTimeIds.add(courseSummary.currentLo.tutorsTimeId);
      courseSummary.studentIds.add(courseSummary.currentLo.tutorsTimeId);
      users = tutorsTimeIds.size;
    }
  }

  function updateCourseSummary(courseSummary: CourseSummary) {
    courseSummary.currentLo.route = `https://reader.tutors.dev${courseSummary.currentLo?.subRoute}`;
    courseSummary.img = courseSummary.currentLo?.img;
    if (courseSummary.currentLo.icon) {
      courseSummary.icon = courseSummary.currentLo.icon;
    } else {
      //courseSummary.icon = null;
    }
  }

  async function visitUpdate(courseId: string) {
    let courseSummary = courses.get(courseId);
    if (!courseSummary) {
      courseSummary = await getCourseSummary(courseId);
      if (courseSummary.isPrivate) return;
      courses.set(courseId, courseSummary);
      los.push(courseSummary);
    }
    const usage = await (await get(child(ref(db), `all-course-access/${courseId}`))).val();
    if (usage.lo) {
      courseSummary.currentLo = usage.lo;
      if (!usage.lo.icon) {
        // @ts-ignore
        courseSummary.icon = "";
      }
      courseSummary.img = courseSummary.img;
      courseSummary.visits = usage.visits;
      updateCourseSummary(courseSummary);
      updateNmrUsers(courseSummary);
      los = [...los];
      modules = los.length;
    }
  }

  async function startListening(allCourses: any) {
    allCourses.forEach((courseAccess: any) => {
      const courseId = courseAccess.courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async () => {
        if (canUpdate) {
          await visitUpdate(courseId);
          visits++;
        }
      });
    });
  }

  onMount(async () => {
    if (data.allCourses) {
      startListening(data.allCourses);
    }
  });
</script>

<AppShell class="h-screen">
  <svelte:fragment slot="header">
    <MainNavigator>
      <svelte:fragment slot="lead">
        <TutorsTitle title="Tutors Live Stream" subtitle={subTitle} />
      </svelte:fragment>
      <div class="hidden md:inline-block">
        <Metric value={modules} title="Active Modules" />
        <Metric value={visits} title="Page Loads" />
        <Metric value={users} title="Students Online" />
      </div>
      <svelte:fragment slot="trail">
        <span class="divider-vertical h-10 hidden lg:block" />
        <LayoutMenu />
      </svelte:fragment>
    </MainNavigator>
  </svelte:fragment>
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <CourseCard {lo} />
      {/each}
    </div>
  </div>
  <svelte:fragment slot="pageFooter">
    <HomeFooter />
  </svelte:fragment>
</AppShell>
