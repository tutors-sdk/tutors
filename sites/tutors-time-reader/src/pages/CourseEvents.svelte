<script lang="ts">
  import { Card } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { fetchAllCourseAccess } from "tutors-reader-lib/src/utils/firebase-utils";
  import { child, get, getDatabase, onValue, ref } from "firebase/database";
  import { toHoursAndMinutes } from "tutors-reader-lib/src/utils/metrics-utils";
  import NavBar from "../navigators/NavBar.svelte";

  let los: Lo[] = [];
  let courseMap = new Map<string, any>();
  let numberModules = 0;
  let title = "Tutors Module Activity";
  let subTitle = "Connecting ...";
  let activeSince = "";
  const db = getDatabase();

  let canUpdate = false;
  setTimeout(function () {
    canUpdate = true;
    activeSince = new Date().toLocaleTimeString();
    subTitle = "Connected ... listening for module activity";
  }, 20 * 1000);

  void startListening();

  function summarise(usage: any, visits: number): string {
    let str = "";
    if (usage.count) str += `Time ${toHoursAndMinutes(usage.count)}: `;
    str += `Visits: ${usage.visits}: `;
    str += `Count: ${visits}: `;
    str += `<br>${usage.title}`;
    return str;
  }

  function usageUpdate(courseId: string, usage: any) {
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
      }
    }
  }

  async function visitUpdate(courseId: string) {
    const usage = await (await get(child(ref(db), `all-course-access/${courseId}`))).val();
    if (usage.lo) {
      usageUpdate(courseId, usage);
      los = [...los];
      numberModules = los.length;
      subTitle = `${numberModules} active since : ${activeSince}`;
    }
  }

  async function startListening() {
    let allCourseAccess = await fetchAllCourseAccess();
    allCourseAccess.forEach((courseAccess) => {
      const courseId = courseAccess.courseId;
      const statusRef = ref(db, `all-course-access/${courseId}/visits`);
      onValue(statusRef, async () => {
        if (canUpdate) {
          await visitUpdate(courseId);
        }
      });
    });
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="sticky top-0 z-40 mb-5">
  <NavBar {title} {subTitle} />
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
