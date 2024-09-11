<script lang="ts">
  import type { Topic } from "$lib/services/models/lo-types";
  import type { Lo } from "$lib/services/models/lo-types";
  import Image from "../../themes/Image.svelte";
  import { currentLo, layout } from "$lib/stores";
  import { onDestroy } from "svelte";
  import TopicContext from "../structure/LoContext.svelte";

  export let topic: Topic;

  let imageHeight = "";
  let headingText = "";
  let text = "";
  let cardWidths = "";
  let lo: Lo;
  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      headingText = "text-xs font-semibold";
      cardWidths = "w-52";
    } else {
      headingText = "text-md font-semibold";
      cardWidths = "w-72";
    }
  });
  currentLo.subscribe((current) => {
    lo = current;
  });
  onDestroy(unsubscribe);
</script>

<div class="card {cardWidths} px-4 py-2">
  <h3 class="px-4 py-2 text-center {headingText}">{topic?.title}</h3>
  <div class="card-body">
    <figure class="flex justify-center p-2">
      <Image {lo} />
    </figure>
    <TopicContext {topic} />
  </div>
</div>
