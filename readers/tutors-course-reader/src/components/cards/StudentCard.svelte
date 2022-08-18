<script lang="ts">
  import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import { cardTransition } from "../animations";
  import Iconify from "@iconify/svelte";

  export let student: StudentMetric;

  let headingText = "text-xs font-medium";
  let text = "text-xs";
  let cardWidths = "w-40 h-56";
  let cardType = "tutorscard-compact";
  let cardHeader = "tutorscard-header-compact";
  let iconHeight = "80";
  let imageHeight = "h-20";

  if (student.topic && student.topic.lo && !student.topic.lo.icon && student.topic.lo.frontMatter && student.topic.lo.frontMatter.icon) {
    student.topic.lo.icon = {
      type: student.topic.lo.frontMatter.icon["type"],
      color: student.topic.lo.frontMatter.icon["color"],
    };
  }
  if (student.lab && !student.lab.icon && student.lab.frontMatter && student.lab.frontMatter.icon) {
    student.lab.icon = {
      type: student.lab.frontMatter.icon["type"],
      color: student.lab.frontMatter.icon["color"],
    };
  }
</script>

<div transition:cardTransition class="{cardType} {cardWidths} border-{getIcon('talk').colour}">
  <div class="flex">
    <div class="w-1/3">
      <img loading="lazy" class="object-scale-down w-20" src={student.img} alt={student.nickname} />
    </div>
    <div class="text-center p-1 {headingText} mt-3">{student.name}</div>
  </div>
  <hr />

  <div>
    {#if student.topic && student.topic.lo.icon}
      <Iconify icon={student.topic.lo.icon.type} color={student.topic.lo.icon.color} height={iconHeight} />
    {:else}
      <img loading="lazy" class="tutorscard-image {imageHeight}" src={student?.topic?.lo.img} alt={student?.topic?.lo.title} />
    {/if}
  </div>
  <div>
    {#if student.lab}
      {#if student.lab.icon}
        <Iconify icon={student.lab.icon.type} color={student.lab.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student.lab.img} alt={student.lab.title} />
      {/if}
    {/if}
  </div>
  <div class="text-xs text-center tutorscard-body">
    <div class="italic mt-2">
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

<style>
  .card {
    max-width: 200px;
    min-width: 200px;
    height: auto;
  }
</style>
