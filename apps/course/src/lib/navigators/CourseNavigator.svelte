<script lang="ts">
  import type { Course } from "tutors-reader-lib/src/models/course";
  import { TopicNavigator } from "tutors-ui";
  import { AccordionGroup, AccordionItem } from "@skeletonlabs/skeleton";

  export let course: Course;
</script>

<AccordionGroup>
  {#each course.topics as topic}
    <AccordionItem>
      <svelte:fragment slot="summary">{topic.lo.title}</svelte:fragment>
      <svelte:fragment slot="content">
        <TopicNavigator topic="{topic}" />
      </svelte:fragment>
    </AccordionItem>
  {/each}
</AccordionGroup>
