<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentLo, layout, portfolio } from "../stores";
  import { Wave } from "svelte-loading-spinners";
  import { readAllCourseIds } from "tutors-reader-lib/src/utils/firebase-utils";
  import axios from "axios";

  let los: Lo[] = [];
  import { getKeys } from "../environment";

  let refresh = false;
  let tickerTape = "Loading...";
  let courseNmr = 0;
  let total = 0;

  $: total = courseNmr;
  let title = "All known Modules";

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    let courseIds = await readAllCourseIds(getKeys().firebase);

    for (let i = 0; i < courseIds.length; i++) {
      try {
        const response = await axios.get<Lo>(`https://${courseIds[i]}.netlify.app/tutors.json`);
        const lo = response.data;
        tickerTape = lo.title;
        courseNmr++;
        lo.type = "web";
        lo.route = `https://reader.tutors.dev//#/course/${courseIds[i]}.netlify.app`;
        lo.img = lo.img.replace("{{COURSEURL}}", `${courseIds[i]}.netlify.app`);
        los.push(lo);
      } catch (error) {
        console.log(`invalid course :${courseIds[i]}`);
      }
    }
    refresh = !refresh;
    // noinspection TypeScriptValidateTypes
    currentLo.set({ title: `${courseIds.length} Known Tutors Modules`, type: "tutors", parentLo: null, img: null });
    return los;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="container mx-auto">
  {#await getAllCourses()}
    <h1>{courseNmr} Known Tutors Modules</h1>
    <div class="border rounded-lg overflow-hidden mt-4 dark:border-gray-700">
      <div class="flex border justify-center items-center dark:border-gray-700">
        <Wave size="280" color="#FF3E00" unit="px" />
      </div>
    </div>
    {total} : {tickerTape}
  {:then courses}
    <CardDeck {los} />
  {/await}
</div>
