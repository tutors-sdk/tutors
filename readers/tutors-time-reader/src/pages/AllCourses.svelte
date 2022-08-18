<script lang="ts">
  import { getContext } from "svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import CardDeck from "../components/cards/CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { currentLo,portfolio } from "../stores";
  import { Wave } from "svelte-loading-spinners";
  import { fetchAllCourseList } from "tutors-reader-lib/src/utils/firebase-utils";

  let los: Lo[] = [];

  const cache: CourseService = getContext("cache");
  let refresh = false;
  let loading = true;
  let tickerTape = "Loading...";
  let courseNmr = 0;
  let total = 0;

  $ : total = courseNmr;
  let title = "All known Modules";

  async function getAllCourses() {
    portfolio.set(true);
    let courses = await fetchAllCourseList();
    courses = courses.filter(course => course.visits > 30);
    for (let i = 0; i < courses.length; i++) {
      const courseLo = await cache.fetchCourse(`${courses[i].url}.netlify.app`);
      if (courseLo != null) {
        courseNmr++;
        courseLo.lo.route = `https://reader.tutors.dev//#/course/${courses[i].url}.netlify.app`;
        courseLo.lo.summary = `Page views: ${courses[i].visits} <br> <small>Last access <br> ${courses[i].last} <small>`;
        courseLo.lo.type = "web";
        los.push(courseLo.lo);
        tickerTape = courseLo.lo.title;
      } else {
        // deleteCourseFromList(`${courses[i].url}`);
      }
    }
    refresh = !refresh;
    loading = false;
    // noinspection TypeScriptValidateTypes
    currentLo.set({ title: `${courseNmr} Known Tutors Modules`, type: "tutors", parentLo: null, img: null });
    return courses;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="container mx-auto">
  {#await getAllCourses() }
    <div class="border rounded-lg overflow-hidden mt-4 dark:border-gray-700">
      <div class="flex border justify-center items-center dark:border-gray-700">
        <Wave size="280" color="#FF3E00" unit="px" />
      </div>
    </div>
    {total} : {tickerTape}
  {:then courses}
    <CardDeck los={los} />
  {/await}
</div>

