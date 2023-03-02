<script lang="ts">
  import type { PageData } from "./$types";
  import { UnitCard, VideoCard } from "tutors-ui";
  import Topic from "./topic.svelte";
  export let data: PageData;
</script>

{#each data.topic.panelVideos as lo}
  <VideoCard lo="{lo}" />
{/each}
{#if data.topic.sideBar.length > 0}
  <div class="block md:flex w-11/12 mx-auto">
    <div class="w-full">
      <Topic topic="{data.topic}" />
    </div>
    <div class="block w-full md:w-[30rem] md:ml-2">
      {#each data.topic.sideBar as unit}
        <UnitCard unit="{unit}" />
      {/each}
    </div>
  </div>
{:else}
  <Topic topic="{data.topic}" />
{/if}
