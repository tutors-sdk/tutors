<script lang="ts">
  import { getContext, onMount } from "svelte";
  import TalkCard from "../components/cards/TalkCard.svelte";
  import TopicNavigatorCard from "../components/cards/TopicNavigatorCard.svelte";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import { revealSidebar } from "../stores";
  import * as animateScroll from "svelte-scrollto";
  import { talkTransition } from "../components/animations";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { CourseService } from "../reader-lib/services/course-service";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let params: Record<string, string>;

  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");
  let title = "";
  let course: Course;

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);

  onMount(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    animateScroll.scrollTo({ delay: 800, element: "#top" });
  });

  async function getTalk(url: string): Promise<Lo> {
    revealSidebar.set(false);
    let lo = await cache.readLo(url, "talk");
    analytics.pageLoad(params.wild, lo);
    title = lo.title;
    return lo;
  }
</script>

{#await getTalk(params.wild)}
  <Loading />
{:then lo}
  {#if !hide}
    <div class="flex">
      <div transition:talkTransition class="flex-grow">
        <TalkCard {lo} />
      </div>
      <div class="hidden lg:block">
        <TopicNavigatorCard topic={lo.parent} />
      </div>
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
