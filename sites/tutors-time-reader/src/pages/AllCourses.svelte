<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentLo, layout, portfolio } from "../stores";
  import { Wave } from "svelte-loading-spinners";
  import { fetchAllCourseAccess, readAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import axios from "axios";

  let los: Lo[] = [];
  let refresh = false;
  let tickerTape = "Loading...";
  let courseNmr = 0;
  let total = 0;

  $: total = 0;
  $: current = 0;
  let title = "All known Modules";

  function compareFn(a: any, b: any) {
    if (a?.count < b?.count) {
      return 1;
    }
    if (a?.count > b?.count) {
      return -1;
    }
    return 0;
  }

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    // let courseIds = await readAllCourseIds(getKeys().firebase);
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 100);
    allCourseAccess.sort(compareFn);
    current = 0;
    total = allCourseAccess.length;
    for (let i = 0; i < allCourseAccess.length; i++) {
      try {
        const courseId = allCourseAccess[i].courseId;
        const response = await axios.get<Lo>(`https://${courseId}.netlify.app/tutors.json`);
        const lo = response.data;
        tickerTape = lo.title;
        current++;
        lo.type = "web";
        lo.route = `https://reader.tutors.dev//#/course/${courseId}.netlify.app`;
        lo.img = lo.img.replace("{{COURSEURL}}", `${courseId}.netlify.app`);
        lo.summary = `${allCourseAccess[i].count / 2}`;
        if (lo.properties.icon) {
          lo.icon = lo.properties.icon;
        }
        los.push(lo);
      } catch (error) {
        console.log(`invalid course :${allCourseAccess[i]}`);
      }
    }
    refresh = !refresh;
    // noinspection TypeScriptValidateTypes
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
