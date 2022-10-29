<script lang="ts">
  import { afterUpdate, getContext, onDestroy, tick } from "svelte";
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import type { CourseService } from "../reader-lib/services/course-service";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import { CardDeck, UnitCard, TalkCard, VideoCard } from "tutors-ui";
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
        <VideoCard {lo} />
      {/each}
      {#each topic.panelTalks as lo}
        <TalkCard {lo} />
      {/each}
      {#each topic.units as unit}
        <UnitCard {unit} />
      {/each}
      <CardDeck los={topic.standardLos} />
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
