<script lang="ts">
  import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
  import { getIcon } from "tutors-reader-lib/src/iconography/themes";
  import { cardTransition } from "../animations";
  import Iconify from "@iconify/svelte";

  export let student: StudentMetric;

  let headingText = "text-xs font-medium";
  let cardWidths = "w-36 h-56";
  let cardType = "tutorscard-compact";
  let iconHeight = "80";
  let imageHeight = "h-24";

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
    <div class="avatar">
      <div class="mt-1 ml-1 w-10 rounded-full">
        <img loading="lazy" class="object-scale-down" src={student.img} alt={student.nickname} />
      </div>
    </div>
    <div class="text-center {headingText} mt-3 mr-1">{student.name}</div>
  </div>

  {#if student.topic && !student.lab}
    <div class="mx-auto my-2">
      {#if student.topic.lo.icon}
        <Iconify icon={student.topic.lo.icon.type} color={student.topic.lo.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student?.topic?.lo.img} alt={student?.topic?.lo.title} />
      {/if}
    </div>
  {/if}
  {#if student.lab && !student.topic}
    <div class="mx-auto my-2">
      {#if student.lab.icon}
        <Iconify icon={student.lab.icon.type} color={student.lab.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student.lab.img} alt={student.lab.title} />
      {/if}
    </div>
  {/if}
  {#if student.topic && student.lab}
    <div class="mx-auto my-1 flex">
      {#if student.topic.lo.icon}
        <Iconify icon={student.topic.lo.icon.type} color={student.topic.lo.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student?.topic?.lo.img} alt={student?.topic?.lo.title} />
      {/if}
      {#if student.lab.icon}
        <Iconify icon={student.lab.icon.type} color={student.lab.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student.lab.img} alt={student.lab.title} />
      {/if}
    </div>
  {/if}
  <div class="tutorscard-body text-center text-xs">
    <div class="mt-2 italic">
      {new Date(student.time).toLocaleTimeString()}
    </div>
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
