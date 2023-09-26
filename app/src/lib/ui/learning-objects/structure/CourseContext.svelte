<script lang="ts">
  import type { Course } from "$lib/services/models/lo-types";
  import TopicContext from "./TopicContext.svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let course: Course;
  console.log(course);
</script>

<Accordion regionPanel="space-y-0.5">
  {#each course.los as lo}
    {#if lo.type === "topic" && !lo.hide}
      <AccordionItem>
        <svelte:fragment slot="summary">{lo.title}</svelte:fragment>
        <svelte:fragment slot="content">
          <TopicContext topic={lo} />
        </svelte:fragment>
      </AccordionItem>
    {/if}
  {/each}
</Accordion>
