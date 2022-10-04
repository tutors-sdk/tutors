<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import CardDeck from "../components/cards/CardDeck.svelte";
  import VideoCard from "../components/cards/VideoCard.svelte";
  import { currentCourse, currentLo } from "../stores";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import * as animateScroll from "svelte-scrollto";
  import { viewDelay } from "../components/animations";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import type Course from "./Course.svelte";

  export let params: Record<string, string>;

  let course: Course;
  currentCourse.subscribe((current) => {
    if (current) course = current;
  });

  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");
  let wallType = "";
  let panelVideos: Lo[] = [];
  let talkVideos: Lo[] = [];
  let title = "";
  let hide = false;

  async function getWall(url: string) {
    wallType = params.wild;
    const los = await cache.readWall(url);
    hide = true;
    setTimeout(() => {
      hide = false;
      const types = params.wild.split("/");
      wallType = types[0];
      if (los && los.length > 0) {
        analytics.pageLoad(params.wild, los[0]);
        // noinspection TypeScriptValidateTypes
        currentLo.set({
          title: `All ${wallType}s in Module`,
          type: wallType,
          route: `#/wall/${url}`,
          parentLo: course.lo,
        });
        title = `All ${wallType}s in Module`;
        if (wallType === "video") {
          panelVideos = los.filter((lo) => lo.type === "panelvideo");
          talkVideos = los.filter((lo) => lo.type !== "panelvideo");
        }
      }
    }, viewDelay);
    return los;
  }

  onMount(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    animateScroll.scrollTo({ delay: 200, element: "#top" });
  });
</script>

{#await getWall(params.wild)}
  <Loading />
{:then los}
  {#if !hide}
    <div class="">
      {#if wallType !== "video"}
        <CardDeck {los} />
      {:else}
        <div class="wall-bg">
          {#each panelVideos as lo}
            <div class="w-1/2 p-2">
              <VideoCard {lo} />
            </div>
          {/each}
        </div>
        <div class="wall-bg">
          {#each talkVideos as lo}
            <div class="w-1/4 p-2">
              <VideoCard {lo} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
