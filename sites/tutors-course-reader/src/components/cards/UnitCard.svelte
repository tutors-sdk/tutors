<script lang="ts">
  import VideoCard from "../cards/VideoCard.svelte";
  import TalkCard from "../cards/TalkCard.svelte";
  import CardDeck from "./CardDeck.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, currentCourse } from "../../stores";
  import { onDestroy } from "svelte";
  export let unit: Lo;
  const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes =  unit.los.filter((lo) => lo.type == "panelnote");
  const standardLos = unit.los.filter((lo) => (lo.type != "panelvideo") && (lo.type != "paneltalk") && (lo.type != "panelnote"));
  import Image from "./Image.svelte";
  import NoteCard from "./NoteCard.svelte";

  let text="text-xl font-semibold";
  const unsubscribe = layout.subscribe(layout => {
    if (layout === "compacted") {
      text="text-l font-normal";
    } else {
      text="text-xl font-semibold";
    }
  });
  onDestroy(unsubscribe);
</script>

<div class="bg-surface-100-800-token rounded-xl backdrop-blur text-base-content rounded-box card-corner mb-2 overflow-hidden w-full mx-auto p-4 place-items-center max-w-full">
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
</div>

