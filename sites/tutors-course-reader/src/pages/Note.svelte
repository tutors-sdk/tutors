<script lang="ts">
  import { getContext, onMount } from "svelte";
  import TopicNavigatorCard from "../components/cards/TopicNavigatorCard.svelte";
  import type { AnalyticsService } from "../reader-lib/services/analytics-service";
  import { revealSidebar } from "../stores";
  import * as animateScroll from "svelte-scrollto";
  import { talkTransition } from "../components/animations";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import NoteCard from "../components/cards/NoteCard.svelte";
  import type { CourseService } from "../reader-lib/services/course-service";
  import Loading from "./support/Loading.svelte";
  import Error from "./support/Error.svelte";

  export let params: Record<string, string>;

  const analytics: AnalyticsService = getContext("analytics");
  const cache: CourseService = getContext("cache");
  let hide = true;
  setTimeout(function () {
    hide = false;
  }, 500);

  onMount(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    animateScroll.scrollTo({ delay: 800, element: "#top" });
  });

  async function getNote(url: string): Promise<Lo> {
    revealSidebar.set(false);
    let lo = await cache.readLo(url, "note");
    analytics.pageLoad(params.wild, lo);
    return lo;
  }
</script>

{#await getNote(params.wild)}
  <Loading />
{:then lo}
  {#if !hide}
    <div class="h-full flex">
      <div transition:talkTransition class="flex-grow card p-4 bg-base-200">
        <NoteCard {lo} />
      </div>
      <div class="hidden lg:block">
        <TopicNavigatorCard topic={lo.parent} />
      </div>
    </div>
  {/if}
{:catch error}
  <Error {error} />
{/await}
