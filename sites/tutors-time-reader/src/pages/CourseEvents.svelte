<script lang="ts">
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, portfolio } from "../stores";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import { getCourseSummary } from "tutors-reader-lib/src/utils/lo-utils";

  let los: Lo[] = [];
  let canUpdate = false;
  let courseMap = new Map<string, Lo>();
  $: numberModules = 0;
  const startTime = new Date().toLocaleString();
  let title = "Current Module Activity";

  layout.set("compacted");
  async function getAllCourses(): Promise<Lo[]> {
    portfolio.set(true);
    const db = getDatabase();
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess = allCourseAccess.filter((usage) => usage?.visits > 100);
    const func = () => {
      canUpdate = true;
    };
    setTimeout(func, 20 * 1000);
    for (let i = 0; i < allCourseAccess.length; i++) {
      const courseId = allCourseAccess[i].courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async (snapshot) => {
        if (canUpdate) {
          const snapshot = await get(child(ref(db), `all-course-access/${courseId}`));
          const usage = snapshot.val();
          const lo = await getCourseSummary(courseId);
          lo.summary = usage.title;
          console.log(courseId);
          const foundLo = courseMap.get(courseId);
          if (foundLo) {
            los = los.filter((lo: Lo) => lo != foundLo);
          }
          los.unshift(lo);
          courseMap.set(courseId, lo);
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
        {numberModules} Modules Active since {startTime}
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
