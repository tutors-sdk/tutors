<script lang="ts">
  import { liveService, LoRecord } from "$lib/services/community";
  import Icon from "../components/Icon.svelte";
  import Card from "../learning-objects/layout/Card.svelte";

  let { course } = $props<{ course: LoRecord }>();

  let students = $derived(
    liveService.studentsOnline.value.filter((lo: LoRecord) => lo.courseId === course.courseId)
  );
</script>

<div
  class="bg-surface-100-800-token border-surface-200-700-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl border-[1px] p-4">
  <div class="flex w-full justify-between pb-2">
    <h2 class="p-2 text-base font-semibold">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/course/{course?.courseId}"
        class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
      >
        <Icon type="course" height="20" /><span>{course?.courseTitle}: Course Home</span>
      </a>
    </h2>
    <h2 class="p-2 text-base font-semibold">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="/live/{course?.courseId}"
        class="text-primary hover:text-primary-dark inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:decoration-primary"
      >
        <Icon type="live" height="20" /><span>Live Stream</span>
      </a>
    </h2>
  </div>
  <div class="flex flex-wrap justify-center">
    {#each students as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <Card 
          cardDetails={{
            route: lo?.loRoute,
            student: lo?.user,
            type: lo?.type,
            summary: lo?.title + " (" + lo?.type + ")",
  
            img: lo?.img,
            icon: lo?.icon,
          }}
          cardLayout={{
            layout: "expanded",
            style: "landscape"
          }}
        />
      {/if}
    {/each}
  </div>
</div>
