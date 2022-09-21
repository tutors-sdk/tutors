<script lang="ts">
  import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
  import Image from "./Image.svelte";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import {layout} from "../../stores";
  export let student: StudentMetric;
  import { cardTransition } from "../animations";
  let headingText = "";
  let text = "";
  let cardWidths = "";
  let cardType = "tutorscard"
  let cardHeader ="tutorscard-header"

  const unsubscribe = layout.subscribe(layout => {
    if (layout === "compacted") {
      headingText = "text-xs font-medium";
      text = "text-xs";
      cardWidths = "w-32 h-56";
      cardType = "tutorscard-compact"
      cardHeader ="tutorscard-header-compact"
    } else {
      headingText = "text-md font-normal";
      text = "text-sm";
      cardWidths = "w-60";
      cardType = "tutorscard";
      cardHeader ="tutorscard-header";
    }
  });

</script>

<style>
  .card {
    max-width: 200px;
    min-width: 200px;
    height: auto
  }
</style>

<div transition:cardTransition class="{cardType} {cardWidths} border-{getIcon('talk').colour}">
  <div class="text-center p-1 {headingText}"> {student.name} </div>
  <hr>
  <div class="grid grid-cols-2 gap-1">
    <div>
      <img loading="lazy" class="object-scale-down  h-24" src="{student.img}" alt="{student.nickname}">
    </div>
    <div>
      <Image lo={student.topic.lo}/>
    </div>
    <div>
      {#if student.lab }
        <Image lo={student.lab}/>
      {/if}
    </div>
    <div class="text-xs text-center">
      <div class="italic mt-2">
        {new Date(student.time).toLocaleTimeString()}
      </div>
      <hr>
      <div class="mt-2">
        {#if student.topic }
          <div><span class="italic"> </span>{student.topic.lo.title}</div>
        {/if}
        {#if student.lab }
          <div><span class="italic"> </span>{student.lab.title}</div>
        {/if}
      </div>
    </div>
  </div>
</div>
