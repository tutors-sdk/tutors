<script lang="ts">
  import { afterUpdate, getContext, onDestroy, tick } from "svelte";
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import type { CourseService } from "../reader-lib/services/course-service";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import CardDeck from "../components/cards/CardDeck.svelte";
  import VideoCard from "../components/cards/VideoCard.svelte";
  import UnitCard from "../components/cards/UnitCard.svelte";
  import TalkCard from "../components/cards/TalkCard.svelte";
  import { currentLo, layout, revealSidebar } from "../stores";
  import * as animateScroll from "svelte-scrollto";
  import { viewDelay } from "../components/animations";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";

  export let params: { wild?: string } = {};
  const cache: CourseService = getContext("cache");
  const analytics: AnalyticsService = getContext("analytics");

  let topic: Topic = null;
  let unitId = "";
  let title = "";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, viewDelay);

  async function getTopic(url: string) {
    revealSidebar.set(false);
    unitId = "";
    let unitPos: number = url.indexOf("/unit");
    if (unitPos !== -1) {
      unitId = url.substr(unitPos + 1);
      url = url.substr(0, unitPos);
    }
    topic = await cache.readTopic(url);
    if (unitPos !== -1) {
      let unitLo = topic.lo.los.filter((lo) => lo.id == unitId);
      currentLo.set(unitLo[0]);
    } else {
      currentLo.set(topic.lo);
      title = topic.lo.title;
      unitId = "";
    }
    analytics.pageLoad(params.wild, topic.lo);
    return topic;
  }

  afterUpdate(async () => {
    if (unitId) {
      await tick();
      animateScroll.scrollTo({ delay: 500, element: "#" + unitId });
    } else {
      animateScroll.scrollTo({ delay: 200, element: "#top" });
    }
  });

  let grid = "";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      grid = "grid grid-cols-2 gap-2 ";
    } else {
      grid = "";
    }
  });
  onDestroy(unsubscribe);
</script>

{#await getTopic(params.wild)}
  <Loading />
{:then topic}
  {#if !hide}
    <div class={grid}>
      {#each topic.panelVideos as lo}
      <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-11/12 mx-auto p-4 place-items-center max-w-full">
        <VideoCard {lo} />
        </div>
      {/each}
      {#each topic.panelTalks as lo}
      <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-11/12 mx-auto p-4 place-items-center max-w-full">
        <TalkCard {lo} />
        </div>
      {/each}
      {#each topic.units as unit}
      <div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-11/12 mx-auto p-4 place-items-center max-w-full">
          <UnitCard {unit} />
        </div>
      {/each}
      <CardDeck los={topic.standardLos} />
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
