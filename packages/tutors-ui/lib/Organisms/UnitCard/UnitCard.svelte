<script lang="ts">
  import { CardDeck, Image, NoteCard, TalkCard, VideoCard } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { layout, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy } from "svelte";
  export let unit: Lo;
  const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes = unit.los.filter((lo) => lo.type == "panelnote");
  const standardLos = unit.los.filter((lo) => lo.type != "panelvideo" && lo.type != "paneltalk" && lo.type != "panelnote");

  let text = "text-xl font-semibold";
  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      text = "text-lg font-semibold";
    } else {
      text = "text-xl font-semibold";
    }
  });
  onDestroy(unsubscribe);
</script>

<div class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur">
  <div class="flex w-full justify-between pb-2">
    <h2 id="{unit.id}" class="p-2 {text}">
      {unit.title}
    </h2>
    <Image lo="{$currentCourse.lo}" miniImage="{true}" />
  </div>
  <div class="flex flex-wrap justify-center">
    {#each panelVideos as lo}
      <VideoCard lo="{lo}" />
    {/each}
    {#each panelTalks as lo}
      <TalkCard lo="{lo}" />
    {/each}
    {#each panelNotes as lo}
      <NoteCard lo="{lo}" />
    {/each}
    <CardDeck los="{standardLos}" />
  </div>
</div>
