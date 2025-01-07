<script lang="ts">
  import type { CourseVisit } from "$lib/services/types.svelte";
  import Card from "../learning-objects/layout/Card.svelte";

  interface Props {
    courseRecords: CourseVisit[];
  }
  let { courseRecords = [] }: Props = $props();
  // tabSet.value = 4;
</script>

<div class="flex flex-wrap justify-center">
  {#each courseRecords as courseRecord}
    <Card
      cardDetails={{
        route: `/course/${courseRecord?.id}`,
        title: courseRecord?.title,
        type: "course",
        summary: courseRecord?.credits,
        img: courseRecord?.img,
        icon: courseRecord?.icon
      }}
    />
  {/each}
</div>
