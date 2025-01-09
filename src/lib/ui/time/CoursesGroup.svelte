<script lang="ts">
  import { liveService } from "$lib/services/community";
  import CourseGroup from "./CourseGroup.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each liveService.studentsOnlineByCourse.value as los}
    <CourseGroup {los} />
  {/each}
</div>
