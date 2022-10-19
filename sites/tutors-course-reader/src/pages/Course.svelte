<script lang="ts">
  import { afterUpdate, getContext, onDestroy } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import CardDeck from "../components/cards/CardDeck.svelte";
  import UnitCard from "../components/cards/UnitCard.svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import { currentLo, revealSidebar } from "../stores";
  import * as animateScroll from "svelte-scrollto";
  import { viewDelay } from "../components/animations";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";

  export let params: Record<string, string> | null;

  let course: Course = null;
  const cache: CourseService = getContext("cache");
  const analytics: AnalyticsService = getContext("analytics");
  let title = "";
  let standardDeck = true;
  let pinBuffer = "";
  let ignorePin = "";
  let hide = true;
  window.addEventListener("keydown", keypressInput);

  async function getCourse(url: string): Promise<Course> {
    revealSidebar.set(false);
    course = await cache.readCourse(url);
    hide = true;
    setTimeout(() => {
      hide = false;
      // noinspection TypeScriptValidateTypes
      currentLo.set(course.lo);
      title = course.lo.title;
      analytics.pageLoad(url, course.lo);
      if (course.lo.properties.ignorepin) {
        ignorePin = course.lo.properties.ignorepin.toString();
      }
    }, viewDelay);
    return course;
  }

  function keypressInput(e: { key: string }) {
    pinBuffer = pinBuffer.concat(e.key);
    if (pinBuffer === ignorePin) {
      course.showAllLos();
      course.standardLos = course.allLos;
      standardDeck = false;
    }
  }

  onDestroy(() => {
    window.removeEventListener("keydown", keypressInput);
  });

  afterUpdate(() => {
    animateScroll.scrollTo({ delay: 200, element: "#top" });
  });
</script>


{#await getCourse(params.wild)}
  <Loading />
{:then course}
  {#if !hide}
    {#each course.units as unit}
    <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-full mx-auto p-4 place-items-center max-w-full">
      <UnitCard {unit} />
    </div>
    {/each}
    {#if standardDeck}
    <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-full mx-auto p-4 place-items-center max-w-full">
      <CardDeck los={course.standardLos} />
      </div>
    {:else}
    <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-full mx-auto p-4 place-items-center max-w-full">
      <CardDeck los={course.allLos} />
      </div>
    {/if}
  {/if}
{:catch error}
  <Error {error} />
{/await}
