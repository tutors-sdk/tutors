<script lang="ts">
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import { CardDeck, UnitCard, TalkCard, VideoCard } from "tutors-ui";
  export let topic: Topic;
</script>

{#each topic.panelVideos as lo}
  <VideoCard lo="{lo}" />
{/each}
{#each topic.panelTalks as lo}
  <TalkCard lo="{lo}" />
{/each}
{#each topic.units as unit}
  <UnitCard unit="{unit}" />
{/each}
<CardDeck los="{topic.standardLos}" border />
