<script lang="ts">
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import { CardDeck, UnitCard, TalkCard } from "tutors-ui";
  export let topic: Topic;
</script>

{#each topic.panelTalks as lo}
  <TalkCard lo="{lo}" />
{/each}
{#each topic.units as unit}
  <UnitCard unit="{unit}" />
{/each}
<CardDeck los="{topic.standardLos}" border />
