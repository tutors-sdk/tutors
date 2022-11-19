<script lang="ts">
  import { Card } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getCourseSummary, isValidCourseName } from "tutors-reader-lib/src/utils/course-utils";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";
  import { portfolio } from "tutors-reader-lib/src/stores/stores";
  import NavBar from "../navigators/NavBar.svelte";

  let los: Lo[] = [];
  $: tickerTape = "";
  $: modules = 0;
  let visits = 0;

  function summarise(usage: any): string {
    let str = "Time ";
    str += `${toHoursAndMinutes(usage.count)}<br>`;
    str += "Page Loads: ";
    str += `${usage.visits}`;
    visits += usage.visits;
    return str;
  }

  void getAllCourses();

  async function populate(allCourseAccess: any[]) {
    const localLos: Lo[] = [];
    // total = allCourseAccess.length;
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        const courseId = allCourseAccess[i].courseId;
        const lo = await getCourseSummary(courseId);
        const keepPrivate = lo.properties?.private as unknown as number;
        if (!keepPrivate) {
          modules++;
          tickerTape = `${lo.title}`;
          lo.summary = summarise(allCourseAccess[i]);
          localLos.push(lo);
          los = [...localLos];
          los.sort((lo1: Lo, lo2: Lo) => lo1.title.localeCompare(lo2.title));
        }
      } catch (error: any) {
        console.log(`invalid course :${error.message}`);
      }
    }
  }

  async function getAllCourses() {
    portfolio.set(true);
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess = allCourseAccess.filter((usage) => isValidCourseName(usage.courseId));
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 50);
    await populate(allCourseAccess);
  }
</script>

<svelte:head>
  <title>Tutors Modules</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar title="Tutors Module Ecosystem" subTitle={tickerTape} {modules} {visits} />
</div>
{#if los.length}
  <div
    class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur"
  >
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <Card {lo} />
      {/each}
    </div>
  </div>
{/if}
