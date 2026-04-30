<script lang="ts">
  import { liveService } from "$lib/services/community";
  import StudentCard from "./StudentCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each liveService.studentsOnline.value as lo}
    {#if lo?.user}
      <StudentCard
        {lo}
        showCourseTitle={true}
        cardLayout={{
          layout: "expanded",
          style: "landscape",
        }}
      />
    {/if}
  {/each}
</div>
