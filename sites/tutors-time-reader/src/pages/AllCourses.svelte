<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { courseUrl, currentLo, layout, portfolio } from "../stores";
  import { Wave } from "svelte-loading-spinners";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import axios from "axios";
  import { getCourseSummary, isValidCourseName } from "tutors-reader-lib/src/utils/lo-utils";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";

  let los: Lo[] = [];
  let refresh = false;
  $: tickerTape = "";
  $: total = 0;
  let title = "All known Modules";

  function summarise(usage: any): string {
    let str = "Total Reading Time<br>";
    str += `${toHoursAndMinutes(usage.count)}<br>`;
    str += "Page Loads<br>";
    str += `${usage.visits}<br>`;
    return str;
  }

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess = allCourseAccess.filter((usage) => isValidCourseName(usage.courseId));
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 50);
    allCourseAccess.sort((a: any, b: any) => b?.visits - a?.visits);
    total = allCourseAccess.length;
    let moduleCount = 0;
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        const courseId = allCourseAccess[i].courseId;
        const lo = await getCourseSummary(courseId);
        const keepPrivate = lo.properties?.private as unknown as number;
        if (!keepPrivate) {
          moduleCount++;
          tickerTape = `${moduleCount}: ${lo.title}`;
          lo.summary = summarise(allCourseAccess[i]);
          los.push(lo);
        }
      } catch (error: any) {
        console.log(`invalid course :${error.message}`);
      }
    }
    refresh = !refresh;
    tickerTape = `${moduleCount} read`;
    return los;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="header-container navbar">
  <div class="flex-1">
    <div class="navbar-title">
      <p class="text-lg">
        Tutors Time: {total} Known Modules : {tickerTape}
      </p>
    </div>
  </div>
</div>
<div class="container mx-auto">
  {#await getAllCourses() then courses}
    <CardDeck {los} />
  {/await}
</div>
