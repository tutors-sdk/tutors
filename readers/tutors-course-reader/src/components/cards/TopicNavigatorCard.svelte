<script lang="ts">
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  import TopicNavigator from "../navigators/TopicNavigator.svelte";
  import { currentLo, layout } from "../../stores";
  import { onDestroy } from "svelte";
  import Image from "./Image.svelte";

  export let topic: Topic;

  let imageHeight = "";
  let headingText = "";
  let text = "";
  let cardWidths = "";
  let lo;
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
  const unsubscribeLo = currentLo.subscribe((current) => {
    lo = current;
  });
  onDestroy(unsubscribe);
</script>

<div class="topicnavigator {cardWidths}">
  <div class="topicnavigator-title">
    <h3 class="card-title  {headingText}">{topic.lo.title}</h3>
  </div>
  <figure class="flex justify-center">
    <Image {lo} />
  </figure>
  <div class="card-body p-4">
    <ul class="text-left text-base-content {text}">
      <TopicNavigator {topic} />
    </ul>
  </div>
</div>
