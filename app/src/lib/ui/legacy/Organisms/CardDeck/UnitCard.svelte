<script lang="ts">
  import { CardDeck, Image, NoteCard, TalkCard, VideoCard } from "$lib/ui/legacy";
  import type { Unit } from "$lib/services/models-ng/lo-types";
  import { layout, currentCourse } from "$lib/stores";
  import { onDestroy } from "svelte";
  import PanelDeck from "./PanelDeck.svelte";
  export let unit: Unit;

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
    <Image lo={$currentCourse} miniImage={true} />
  </div>
  <PanelDeck panels={unit.panels} />
  <div class="flex flex-wrap justify-center">
    <CardDeck los={unit.units.standardLos} />
  </div>
</div>
