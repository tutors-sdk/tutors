<script lang="ts">
  import type { PageData } from "./$types";
  import { UnitCard } from "tutors-ui";
  import Topic from "./topic.svelte";
  export let data: PageData;
</script>

{#if data.topic.sideBar.length > 0}
  <div class="flex w-full mx-auto">
    <div class="w-full">
      <Topic topic="{data.topic}" />
    </div>
    <div class="hidden md:block">
      {#each data.topic.sideBar as unit}
        <UnitCard unit="{unit}" />
      {/each}
    </div>
  </div>
{:else}
  <Topic topic="{data.topic}" />
{/if}
