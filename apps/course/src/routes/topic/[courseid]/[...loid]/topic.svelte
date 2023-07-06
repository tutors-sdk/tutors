<script lang="ts">
  import { browser } from "$app/environment";
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import { CardDeck, UnitCard, TalkCard, NoteCard } from "tutors-ui";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  export let topic: Topic;
</script>

{#if browser}
  {#each topic.panelTalks as lo}
    <TalkCard lo="{lo}" />
  {/each}
  {#each topic.panelNotes as lo}
    <NoteCard lo="{lo}" />
  {/each}
  {#each topic.units as unit}
    <UnitCard unit="{unit}" />
  {/each}
  <CardDeck los="{topic.standardLos}" border />
{:else}
  <div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4 flex h-[440px] border-[1px] border-surface-200-700-token">
    <ProgressRadial stroke="{100}" meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20" class="mt-12 mx-auto" />
  </div>
{/if}
