<script lang="ts">
  import type { Course } from "$lib/services/models/lo-types";
  import LoContext from "./LoContext.svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let course: Course;
</script>

<Accordion regionPanel="space-y-0.5">
  {#each course.los as lo}
    <!-- {#if lo.type === "topic" && !lo.hide} -->
    {#if !lo.hide}
      <AccordionItem>
        <svelte:fragment slot="summary">{lo.title}</svelte:fragment>
        <svelte:fragment slot="content">
          <LoContext {lo} />
        </svelte:fragment>
      </AccordionItem>
    {/if}
  {/each}
</Accordion>
