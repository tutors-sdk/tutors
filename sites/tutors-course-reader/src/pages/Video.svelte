<script lang="ts">
  import { afterUpdate, getContext } from "svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { TopicNavigatorCard, VideoCard } from "tutors-ui";
  import type { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { revealSidebar } from "tutors-reader-lib/src/stores/stores";
  import { querystring } from "svelte-spa-router";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import { talkTransition } from "tutors-ui/lib/animations";

  export let params: Record<string, string>;
  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");

  async function getVideo(url: string): Promise<Lo> {
    revealSidebar.set(false);
    if ($querystring) {
      url += "?" + $querystring;
    }
    const lo = await cache.readLo(url, "video");
    analytics.pageLoad(params.wild, lo);
    return lo;
  }

  afterUpdate(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    scrollTo({ top: 0, behavior: "smooth" });
  });
</script>

{#await getVideo(params.wild)}
  <Loading />
{:then lo}
  <div class="min-h-screen flex w-11/12 mx-auto">
    <div transition:talkTransition class="w-full">
      <VideoCard {lo} />
    </div>
    <div class="hidden md:block">
      <TopicNavigatorCard topic={lo.parent} />
    </div>
  </div>
{:catch error}
  <Error {error} />
{/await}
