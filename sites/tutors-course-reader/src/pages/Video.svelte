<script lang="ts">
  import { afterUpdate, getContext } from "svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { TopicNavigatorCard, VideoCard } from "tutors-ui";
  import type { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { revealSidebar } from "tutors-reader-lib/src/stores/stores";
  import { querystring } from "svelte-spa-router";
  import * as animateScroll from "svelte-scrollto";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import { talkTransition } from "tutors-ui/lib/animations";

  export let params: Record<string, string>;
  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");
  let title = "";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);

  async function getVideo(url: string): Promise<Lo> {
    revealSidebar.set(false);
    if ($querystring) {
      url += "?" + $querystring;
    }
    const lo = await cache.readLo(url, "video");
    analytics.pageLoad(params.wild, lo);
    title = lo.title;
    return lo;
  }

  afterUpdate(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    animateScroll.scrollTo({ delay: 200, element: "#top" });
  });
</script>

{#await getVideo(params.wild)}
  <Loading />
{:then lo}
  {#if !hide}
  <div class="min-h-screen flex w-11/12 mx-auto">
    <div transition:talkTransition class="w-full">
        <VideoCard {lo} />
      </div>
      <div class="hidden md:block">
        <TopicNavigatorCard topic={lo.parent} />
      </div>
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
