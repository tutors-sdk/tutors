<script lang="ts">
  import { afterUpdate, tick } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard, TalkCard, VideoCard } from "tutors-ui";
  export let data: PageData;
  // import * as animateScroll from "svelte-scrollto";

  // afterUpdate(async () => {
  //   if (data.unitId) {
  //     animateScroll.scrollTo({ element: `#${data.unitId}`, duration: 2000 });
  //     // const el = document.getElementById(data.unitId);
  //     // if (el) {
  //     //   el.scrollIntoView();
  //     // }
  //   } else {
  //     const el = document.getElementById("top");
  //     if (el) {
  //       el.scrollIntoView();
  //     }
  //   }
  // });
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
