<script lang="ts">
  import { CardDeck, Image, NoteCard, TalkCard, VideoCard } from "$lib/ui/legacy";
  import type { Composite} from "$lib/services/models-ng/lo-types";
  import { layout, currentCourse } from "$lib/stores";
  import { onDestroy } from "svelte";
  export let lo: Composite;
  // const panelVideos = unit.los.filter((lo) => lo.type == "panelvideo");
  // const panelTalks = unit.los.filter((lo) => lo.type == "paneltalk");
  // const panelNotes = unit.los.filter((lo) => lo.type == "panelnote");
  // const standardLos = unit.los.filter(
  //   (lo) => lo.type != "panelvideo" && lo.type != "paneltalk" && lo.type != "panelnote"
  // );

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

<div class="bg-surface-100-800-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl p-4 border-[1px] border-surface-200-700-token">
  <div class="flex w-full justify-between pb-2">
    <h2 id={lo.id} class="p-2 {text}">
      {lo.title}
    </h2>
    <Image lo={$currentCourse} miniImage={true} />
  </div>
  <div class="flex flex-wrap justify-center">
    {#each lo.unit?.panels?.panelVideos as lo}
      <VideoCard {lo} />
    {/each}
    {#each lo.unit?.panels?.panelTalks as lo}
      <TalkCard {lo} />
    {/each}
    {#each lo.unit?.panels?.panelNotes as lo}
      <NoteCard {lo} />
    {/each}
    <CardDeck los={lo.unit.standardLos} />
  </div>
</div>
