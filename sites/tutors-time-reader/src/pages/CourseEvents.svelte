<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, portfolio } from "../stores";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import { getCourseSummary } from "tutors-reader-lib/src/utils/lo-utils";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";

  let los: Lo[] = [];
  let canUpdate = false;
  let courseMap = new Map<string, Lo>();
  $: numberModules = 0;
  let title = "Tutors Time";
  let subTitle = "Connecting....";

  function summarise(usage: any, visits: number): string {
    let str = `${toHoursAndMinutes(usage.count)}<br>`;
    str += `${usage.visits}<br>`;
    str += `${visits}<br>`;
    str += "<hr><br>";
    str += `${usage.title}`;
    return str;
  }

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    const db = getDatabase();
    let allCourseAccess = await fetchAllCourseAccess();
    const func = () => {
      canUpdate = true;
      subTitle = "";
    };
    setTimeout(func, 20 * 1000);
    for (let i = 0; i < allCourseAccess.length; i++) {
      const courseId = allCourseAccess[i].courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async (snapshot) => {
        if (canUpdate) {
          const snapshot = await get(child(ref(db), `all-course-access/${courseId}`));
          const usage = snapshot.val();
          const foundLo = courseMap.get(courseId);
          console.log(courseId);
          if (foundLo) {
            foundLo.visits++;
            foundLo.summary = summarise(usage, foundLo.visits);
          } else {
            const lo = await getCourseSummary(courseId);
            const keepPrivate = lo.properties?.private as unknown as number;
            if (!keepPrivate) {
              lo.visits = 1;
              lo.summary = summarise(usage, lo.visits);
              courseMap.set(courseId, lo);
              los.push(lo);
            }
          }
          los.sort((a: any, b: any) => b?.visits - a?.visits);
          los = [...los];
          numberModules = los.length;
        }
      });
    }
    return los;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="header-container navbar">
  <div class="flex-1">
    <div class="navbar-title">
      <p class="text-center text-lg">
        Tutors Time: {numberModules} Modules Currently Online : {new Date().toLocaleString()}
        {subTitle}
      </p>
    </div>
  </div>
</div>
<div class="container mx-auto">
  {#await getAllCourses()}
    <h1>waiting</h1>
  {:then courses}
    <CardDeck {los} />
  {/await}
</div>
