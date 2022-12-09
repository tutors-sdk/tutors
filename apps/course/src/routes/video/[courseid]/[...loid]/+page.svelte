<script lang="ts">
  import type { PageData } from "./$types";
  import { VideoCard, TopicNavigatorCard } from "tutors-ui";
  export let data: PageData;
</script>

{#if data.lo}
  <div class="min-h-screen flex w-11/12 mx-auto">
    <div class="w-full">
      {#key data.lo}
        <VideoCard lo="{data.lo}" />
      {/key}
    </div>
    <div class="hidden md:block">
      <TopicNavigatorCard topic="{data.lo.parent}" />
    </div>
  </div>
{/if}
