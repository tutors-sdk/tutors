<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import { talkTransition } from "tutors-ui/lib/animations";
  import { TopicNavigatorCard, TalkCard } from "tutors-ui";
  export let data: PageData;
</script>

{#if data.lo}
  <div class="flex w-11/12 mx-auto">
    <div class="w-full">
      {#key data.lo}
        <TalkCard lo="{data.lo}" />
      {/key}
    </div>
    <div class="hidden md:block">
      <TopicNavigatorCard topic="{data.lo.parent}" />
    </div>
  </div>
{/if}
