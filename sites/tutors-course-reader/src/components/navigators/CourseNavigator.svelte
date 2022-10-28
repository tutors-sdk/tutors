<script lang="ts">
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { TopicNavigator } from "tutors-ui";
  import { AccordionGroup, AccordionItem } from "@brainandbones/skeleton";

  export let course: Course = null;
</script>

<AccordionGroup>
  {#each course.topics as topic}
    <AccordionItem>
      <svelte:fragment slot="summary">{topic.lo.title}</svelte:fragment>
      <svelte:fragment slot="content">
        <TopicNavigator {topic} />
      </svelte:fragment>
    </AccordionItem>
  {/each}
</AccordionGroup>
