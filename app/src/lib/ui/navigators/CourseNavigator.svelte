<script lang="ts">
  import type { Course } from "$lib/services/models/lo-types";
  import { TopicNavigator } from "$lib/ui/legacy";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let course: Course;
</script>

<Accordion regionPanel="space-y-0.5">
  {#each course.los as lo}
    <AccordionItem>
      <svelte:fragment slot="summary">{lo.title}</svelte:fragment>
      <svelte:fragment slot="content">
        {#if lo.type === "topic"}
          <TopicNavigator topic={lo} />
        {/if}
      </svelte:fragment>
    </AccordionItem>
  {/each}
</Accordion>
