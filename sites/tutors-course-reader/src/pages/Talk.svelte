<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { TalkCard, TopicNavigatorCard } from "tutors-ui";
  import type { AnalyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import { revealSidebar } from "tutors-reader-lib/src/stores/stores";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";
  import type { CourseService } from "tutors-reader-lib/src/services/course-service";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { talkTransition } from "tutors-ui/lib/animations";

  export let params: Record<string, string>;

  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");
  let title = "";

  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);

  onMount(() => {
    document.getElementById("top").scrollIntoView();
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
    <div class="flex w-11/12 mx-auto">
      <div transition:talkTransition class="w-full">
        <TalkCard {lo} />
      </div>
      <div class="hidden md:block">
        <TopicNavigatorCard topic={lo.parent} />
      </div>
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
