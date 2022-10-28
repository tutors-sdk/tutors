<script lang="ts">
  import VideoCard from "../cards/VideoCard.svelte";
  import TalkCard from "../cards/TalkCard.svelte";
  import { CardDeck, Image, NoteCard } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, currentCourse } from "../../stores";
  import { onDestroy } from "svelte";
  export let unit: Lo;
  const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes =  unit.los.filter((lo) => lo.type == "panelnote");
  const standardLos = unit.los.filter((lo) => (lo.type != "panelvideo") && (lo.type != "paneltalk") && (lo.type != "panelnote"));

  let text="text-xl font-semibold";
  const unsubscribe = layout.subscribe(layout => {
    if (layout === "compacted") {
      text="text-lg font-semibold";
    } else {
      text="text-xl font-semibold";
    }
  });
  onDestroy(unsubscribe);
</script>

  <div class="flex justify-between w-full pb-2">
    <h2 id="{unit.id}" class="p-2 {text}">
      {unit.title}
    </h2>
    <Image lo={$currentCourse.lo} miniImage={true} />
  </div>
  <div class="flex flex-wrap justify-center">
    {#each panelVideos as lo}
      <VideoCard {lo} />
    {/each}
    {#each panelTalks as lo}
      <TalkCard {lo} />
    {/each}
    {#each panelNotes as lo}
      <NoteCard {lo}  />
    {/each}
    <CardDeck los={standardLos} />
  </div>

