<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Cards from "../layout/Cards.svelte";
  import Video from "../content/Video.svelte";
  import { currentCourse } from "$lib/runes.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import Podcast from "../content/Podcast.svelte";

  interface Props {
    los: Lo[];
    type: string;
  }
  let { los, type }: Props = $props();

  let panelVideos = los.filter((lo) => lo.type === "panelvideo");
  let talkVideos = los.filter((lo) => lo.type !== "panelvideo");
</script>

<SecondaryNavigator lo={currentCourse.value} parentCourse={currentCourse.value?.properties?.parent} />
<div class="flex flex-wrap justify-center">
  {#key los}
    {#if type !== "video" && type !== "podcast"}
      <Cards {los} />
    {:else if type === "podcast"}
      <div class="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each los as lo}
          <div class="flex justify-center">
            <Podcast {lo} hideSummary={true} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-wrap justify-center">
        {#each panelVideos as lo}
          <div class="flex justify-center">
            <Video {lo} />
          </div>
        {/each}
      </div>
      <div class="flex flex-wrap justify-center">
        {#each talkVideos as lo}
          <div class="flex justify-center">
            <Video {lo} />
          </div>
        {/each}
      </div>
    {/if}
  {/key}
</div>
