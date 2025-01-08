<script lang="ts">
  import type { Lo } from "$lib/services/base/lo-types";
  import Cards from "../layout/Cards.svelte";
  import Video from "../content/Video.svelte";

  interface Props {
    los: Lo[];
    type: string;
  }
  let { los, type }: Props = $props();

  let panelVideos = los.filter((lo) => lo.type === "panelvideo");
  let talkVideos = los.filter((lo) => lo.type !== "panelvideo");
</script>

<div class="flex flex-wrap justify-center">
  {#key los}
    {#if type !== "video"}
      <Cards {los} />
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
