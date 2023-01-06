<script lang="ts">
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard, TalkCard, VideoCard } from "tutors-ui";
  export let data: PageData;
</script>

<div>
  {#each data.topic.panelVideos as lo}
    <VideoCard lo="{lo}" />
  {/each}
  {#each data.topic.panelTalks as lo}
    <TalkCard lo="{lo}" />
  {/each}
  {#each data.topic.units as unit}
    <UnitCard unit="{unit}" />
  {/each}
  <CardDeck los="{data.topic.standardLos}" />
</div>
