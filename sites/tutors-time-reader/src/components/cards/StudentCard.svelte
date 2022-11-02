<script lang="ts">
  import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
  import { Image } from "tutors-ui";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import { layout } from "../../stores";
  import { cardTransition } from "../animations";
  import { onDestroy } from "svelte";

  export let student: StudentMetric;
  let headingText = "";
  let text = "";
  let cardWidths = "";
  let cardType = "tutorscard";
  let cardHeader = "tutorscard-header";

  const unsubscribe = layout.subscribe((layout) => {
    if (layout === "compacted") {
      headingText = "text-xs font-medium";
      text = "text-xs";
      cardWidths = "w-32 h-56";
      cardType = "tutorscard-compact";
      cardHeader = "tutorscard-header-compact";
    } else {
      headingText = "text-md font-normal";
      text = "text-sm";
      cardWidths = "w-60";
      cardType = "tutorscard";
      cardHeader = "tutorscard-header";
    }
  });

  onDestroy(unsubscribe);
</script>

<div transition:cardTransition class="{cardType} {cardWidths} border-{getIcon('talk').colour}">
  <div class="p-1 text-center {headingText}">{student.name}</div>
  <hr />
  <div class="grid grid-cols-2 gap-1">
    <div>
      <img loading="lazy" class="h-24  object-scale-down" src={student.img} alt={student.nickname} />
    </div>
    <div>
      <Image lo={student.topic.lo} />
    </div>
    <div>
      {#if student.lab}
        <Image lo={student.lab} />
      {/if}
    </div>
    <div class="text-center text-xs">
      <div class="mt-2 italic">
        {new Date(student.time).toLocaleTimeString()}
      </div>
      <hr />
      <div class="mt-2">
        {#if student.topic}
          <div><span class="italic" />{student.topic.lo.title}</div>
        {/if}
        {#if student.lab}
          <div><span class="italic" />{student.lab.title}</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    max-width: 200px;
    min-width: 200px;
    height: auto;
  }
</style>
