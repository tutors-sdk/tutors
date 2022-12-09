<script lang="ts">
  import type { PageData } from "./$types";
  import { CardDeck, VideoCard } from "tutors-ui";
  export let data: PageData;
</script>

<div class="container mx-auto">
  {#key data.los}
    {#if data.type !== "video"}
      <CardDeck los="{data.los}" />
    {:else}
      <div class="flex flex-wrap justify-center">
        {#each data.panelVideos as lo}
          <div class="w-2/5 p-2 card m-2">
            <VideoCard lo="{lo}" />
          </div>
        {/each}
      </div>
      <div class="flex flex-wrap justify-center">
        {#each data.talkVideos as lo}
          <div class="w-2/5 p-2 card m-2">
            <VideoCard lo="{lo}" />
          </div>
        {/each}
      </div>
    {/if}
  {/key}
</div>
