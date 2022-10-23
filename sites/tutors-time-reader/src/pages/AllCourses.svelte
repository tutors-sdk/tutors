<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getCourseSummary, isValidCourseName } from "tutors-reader-lib/src/utils/lo-utils";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";
  import { layout, portfolio } from "../stores";
  import SecondaryNavigator from "../components/navigators/SecondaryNavigator.svelte";

  let los: Lo[];
  $: tickerTape = "";
  $: total = 0;
  $: moduleCount = 0;
  let title = "All known Modules";

  function summarise(usage: any): string {
    let str = "Total Reading Time<br>";
    str += `${toHoursAndMinutes(usage.count)}<br>`;
    str += "Page Loads<br>";
    str += `${usage.visits}<br>`;
    return str;
  }

  layout.set("compacted");
  void getAllCourses();

  async function populate(allCourseAccess: any[]) {
    const localLos: Lo[] = [];
    total = allCourseAccess.length;
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        const courseId = allCourseAccess[i].courseId;
        const lo = await getCourseSummary(courseId);
        const keepPrivate = lo.properties?.private as unknown as number;
        if (!keepPrivate) {
          moduleCount++;
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
  <title>{title}</title>
</svelte:head>

<SecondaryNavigator title="Tutors Module Ecosystem: {moduleCount} Modules " subTitle={tickerTape} />
<div class="container mx-auto">
  <CardDeck {los} />
</div>
