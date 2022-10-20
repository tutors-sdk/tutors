<script lang="ts">
  import type { StudentMetric } from "tutors-reader-lib/src/types/metrics-types";
  import { cardTransition } from "../animations";
  import Iconify from "@iconify/svelte";
  import { Avatar } from "@brainandbones/skeleton";

  export let student: StudentMetric;

  let headingText = "text-xs font-medium";
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

<div transition:cardTransition class="card w-2/5 h-90 overflow-x-hidden m-1">
  <div class="flex">
    <header class="card-header inline-flex">
      <Avatar src={student.img} alt={student.nickname} />
    <h6>{student.name}</h6>
  </header>
  </div>
    <div class="card-body">
      {#if student.topic && !student.lab}
    <div class="justify-center my-2">
      {#if student.topic.lo.icon}
        <Iconify icon={student.topic.lo.icon.type} color={student.topic.lo.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student?.topic?.lo.img} alt={student?.topic?.lo.title} />
      {/if}
    </div>
  {/if}
  {#if student.lab && !student.topic}
    <div class="justify-center my-2">
      {#if student.lab.icon}
        <Iconify icon={student.lab.icon.type} color={student.lab.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student.lab.img} alt={student.lab.title} />
      {/if}
    </div>
  {/if}
  {#if student.topic && student.lab}
    <div class="justify-center my-1 flex">
      {#if student.lab.icon}
        <Iconify icon={student.lab.icon.type} color={student.lab.icon.color} height={iconHeight} />
      {:else}
        <img loading="lazy" class="tutorscard-image {imageHeight}" src={student.lab.img} alt={student.lab.title} />
      {/if}
    </div>
  {/if}
    </div>
    <footer class="card-footer text-center">
      <p class="mt-2 italic">
        {new Date(student.time).toLocaleTimeString()}
      </p>
      <p class="mt-2 font-semibold">
        {#if student.topic}
          <div><span class="italic" />{student.topic.lo.title}</div>
        {/if}
        {#if student.lab}
          <div><span class="italic" />{student.lab.title}</div>
        {/if}
      </p>
    </footer>
  </div>