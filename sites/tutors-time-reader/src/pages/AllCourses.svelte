<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentLo, layout, portfolio } from "../stores";
  import { Wave } from "svelte-loading-spinners";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import axios from "axios";
  import { getCourseSummary } from "tutors-reader-lib/src/utils/lo-utils";

  let los: Lo[] = [];
  let refresh = false;
  let tickerTape = "Loading...";
  let total = 0;

  $: total = 0;
  $: current = 0;
  let title = "All known Modules";

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 100);
    allCourseAccess.sort((a: any, b: any) => b?.count - a?.count);
    current = 0;
    total = allCourseAccess.length;
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        const courseId = allCourseAccess[i].courseId;
        const lo = await getCourseSummary(courseId);
        tickerTape = lo.title;
        current++;
        lo.summary = `${allCourseAccess[i].count / 2}`;
        los.push(lo);
      } catch (error) {
        console.log(`invalid course :${allCourseAccess[i]}`);
      }
    }
    refresh = !refresh;
    currentLo.set({ title: `${allCourseAccess.length} Known Tutors Modules`, type: "tutors", parentLo: null, img: null });
    return los;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="container mx-auto">
  {#await getAllCourses()}
    <h1>{total} Known Tutors Modules</h1>
    <div class="border rounded-lg overflow-hidden mt-4 dark:border-gray-700">
      <div class="flex border justify-center items-center dark:border-gray-700">
        <Wave size="280" color="#FF3E00" unit="px" />
      </div>
    </div>
    {current} : {tickerTape}
  {:then courses}
    <CardDeck {los} />
  {/await}
</div>
