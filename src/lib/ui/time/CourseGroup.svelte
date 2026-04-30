<script lang="ts">
  import { liveService, LoRecord } from "$lib/services/community";
  import CourseGroupHeader from "./CourseGroupHeader.svelte";
  import StudentCard from "./StudentCard.svelte";

  let { course } = $props<{ course: LoRecord }>();

  let students = $derived(
    liveService.studentsOnline.value.filter((lo: LoRecord) => lo.courseId === course.courseId)
  );
</script>

<div
  class="bg-surface-100-800-token border-surface-200-700-token mx-auto mb-2 w-full place-items-center overflow-hidden rounded-xl border-[1px] p-4">
  <CourseGroupHeader {course} />
  <div class="flex flex-wrap justify-center">
    {#each students as lo}
      {#if lo?.user?.fullName !== "Anon"}
        <StudentCard 
          cardDetails={{
            route: lo?.loRoute,
            student: lo?.user!,
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
