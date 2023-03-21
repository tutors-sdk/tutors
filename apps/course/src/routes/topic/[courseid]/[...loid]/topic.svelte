<script lang="ts">
  import { browser } from '$app/environment';
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import { CardDeck, UnitCard, TalkCard } from "tutors-ui";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  export let topic: Topic;
</script>

{#if browser}
{#each topic.panelTalks as lo}
  <TalkCard lo="{lo}" />
  {/each}
{:else} 
<ProgressRadial stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20" />
{/if}
{#each topic.units as unit}
  <UnitCard unit="{unit}" />
{/each}
<CardDeck los="{topic.standardLos}" border />
