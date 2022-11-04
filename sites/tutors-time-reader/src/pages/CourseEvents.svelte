<script lang="ts">
  import { Card } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { portfolio } from "tutors-reader-lib/src/stores/stores";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";
  import NavBar from "../navigators/NavBar.svelte";

  let los: Lo[] = [];
  let canUpdate = false;
  let courseMap = new Map<string, any>();
  $: numberModules = 0;
  let title = "Tutors Time";
  $: subTitle = "Connecting ...";
  let activeSince = "";

  void startListening();

  function summarise(usage: any, visits: number): string {
    let str = "";
    if (usage.count) str += `Time ${toHoursAndMinutes(usage.count)}: `;
    str += `Visits: ${usage.visits}: `;
    str += `Count: ${visits}: `;
    str += `<br>${usage.title}`;
    return str;
  }

  async function startListening() {
    portfolio.set(true);
    const db = getDatabase();
    let allCourseAccess = await fetchAllCourseAccess();
    const func = () => {
      canUpdate = true;
      activeSince = new Date().toLocaleTimeString();
      subTitle = "Connected ... listening for module activity";
    };
    setTimeout(func, 20 * 1000);
    for (let i = 0; i < allCourseAccess.length; i++) {
      const courseId = allCourseAccess[i].courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async () => {
        if (canUpdate) {
          const snapshot = await get(child(ref(db), `all-course-access/${courseId}`));
          const usage = snapshot.val();
          if (usage.lo) {
            const lo = usage.lo;
            const foundLo = courseMap.get(courseId);
            if (foundLo) {
              foundLo.title = lo.courseTitle;
              foundLo.visits++;
              foundLo.summary = summarise(usage, foundLo.visits);
              foundLo.route = `https://reader.tutors.dev${lo.subRoute}`;
              if (lo.img) {
                foundLo.img = lo.img;
                if (lo.icon) {
                  foundLo.icon = lo.icon;
                } else {
                  foundLo.icon = null;
                }
              }
            } else {
              if (!lo.isPrivate) {
                const loCopy = { ...lo };
                loCopy.title = lo.courseTitle;
                loCopy.route = `https://reader.tutors.dev${lo.subRoute}`;
                loCopy.visits = 1;
                loCopy.summary = summarise(usage, 1);
                loCopy.type = "web";
                courseMap.set(courseId, loCopy);
                los.push(loCopy);
                numberModules++;
                subTitle = `${numberModules} active since : ${activeSince}`;
              }
            }
            los = [...los];
            numberModules = los.length;
          }
        }
      });
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar title="Tutors Module Activity" {subTitle} />
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
