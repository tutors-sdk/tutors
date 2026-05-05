<script lang="ts">
  import { liveService } from "$lib/services/community";
  import CourseGroup from "./CourseGroup.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each liveService.coursesOnline.value as course}
    <CourseGroup courseId={course.courseId!} courseTitle={course.courseTitle!} />
  {/each}
</div>
