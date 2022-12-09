<script lang="ts">
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";
  import { Image, TopicNavigator } from "tutors-ui";
  import { currentLo, layout } from "tutors-reader-lib/src/stores/stores";
  import { onDestroy } from "svelte";

  export let topic: Topic;

  let imageHeight = "";
  let headingText = "";
  let text = "";
  let cardWidths = "";
  let lo: Lo;
  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      imageHeight = "h-20";
      headingText = "text-xs font-semibold";
      text = "text-xs";
      cardWidths = "w-32";
    } else {
      imageHeight = "h-48";
      headingText = "text-md font-semibold";
      text = "text-sm";
      cardWidths = "w-72";
    }
  });
  currentLo.subscribe((current) => {
    lo = current;
  });
  onDestroy(unsubscribe);
  // onDestroy(unsubscribeLo);
</script>

<div class="{cardWidths}">
  <div class="card">
    <h3 class="px-4 pt-6 pb-2 text-center">{topic?.lo?.title}</h3>
    <div class="card-body">
      <figure class="flex justify-center">
        <Image lo="{lo}" />
      </figure>
      <TopicNavigator topic="{topic}" />
    </div>
  </div>
</div>
