<script lang="ts">
  import { afterUpdate, getContext, onDestroy, onMount } from "svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { CardDeck, UnitCard } from "tutors-ui";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import type { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { currentLo, revealSidebar } from "tutors-reader-lib/src/stores/stores";
  import * as animateScroll from "svelte-scrollto";
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
    }, 500);
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

  onMount(() => {
    scrollTo({ top: 0, behavior: "smooth" });
  });

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
      <UnitCard {unit} />
    {/each}
    {#if standardDeck}
      <CardDeck los={course.standardLos} />
    {:else}
      <CardDeck los={course.allLos} />
    {/if}
  {/if}
{:catch error}
  <Error {error} />
{/await}
