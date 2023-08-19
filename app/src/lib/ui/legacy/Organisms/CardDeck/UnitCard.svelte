<script lang="ts">
  import { CardDeck, Image, NoteCard, TalkCard, VideoCard } from "$lib/ui/legacy";
  import type { Lo } from "$lib/services/types/lo";
  import { layout, currentCourse } from "$lib/stores";
  import { onDestroy } from "svelte";
  export let unit: Lo;
  const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  const panelNotes = unit.los.filter((lo) => lo.type == "panelnote");
  const standardLos = unit.los.filter(
    (lo) => lo.type != "panelvideo" && lo.type != "paneltalk" && lo.type != "panelnote"
  );

  let text = "!text-xl font-semibold";
  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      text = "!text-xl font-semibold";
    } else {
      text = "!text-xl font-semibold";
    }
  });
  onDestroy(unsubscribe);
</script>

<div
  class="bg-surface-100-800-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl p-4 border-[1px] border-surface-200-700-token"
>
  <div class="flex w-full justify-between pb-2">
    <h2 id={unit.id} class="p-2 {text}">
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
      <NoteCard {lo} />
    {/each}
    <CardDeck los={standardLos} />
  </div>
</div>
