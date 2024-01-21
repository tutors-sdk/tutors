<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import Cards from "../layout/Cards.svelte";
  import Video from "../content/Video.svelte";
  export let los: Lo[];
  export let type: string;
  let panelVideos = los.filter((lo) => lo.type === "panelvideo");
  let talkVideos = los.filter((lo) => lo.type !== "panelvideo");
</script>

<div class="container mx-auto">
  {#key los}
    {#if type !== "video"}
      <Cards {los} />
    {:else}
      <div class="flex flex-wrap justify-center">
        {#each panelVideos as lo}
          <div class="w-2/5 p-2 card m-2">
            <Video {lo} />
          </div>
        {/each}
      </div>
      <div class="flex flex-wrap justify-center">
        {#each talkVideos as lo}
          <div class="w-2/5 p-2 card m-2">
            <Video {lo} />
          </div>
        {/each}
      </div>
    {/if}
  {/key}
</div>
