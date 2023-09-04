<script lang="ts">
  import type { Course } from "$lib/services/models-ng/lo-types";
  import { TopicNavigator } from "$lib/ui/legacy";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let course: Course;
</script>

<Accordion regionPanel="space-y-0.5">
  {#each course.los as topic}
    <AccordionItem>
      <svelte:fragment slot="summary">{topic.title}</svelte:fragment>
      <svelte:fragment slot="content">
        <TopicNavigator {topic} />
      </svelte:fragment>
    </AccordionItem>
  {/each}
</Accordion>
