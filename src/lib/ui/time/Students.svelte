<script lang="ts">
  import { liveService } from "$lib/services/community/services/live.svelte";
  import Card from "../learning-objects/layout/Card.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each liveService.studentsOnline.value as lo}
    <Card
      cardDetails={{
        route: lo?.loRoute,
        student: lo?.user,
        type: lo?.type,
        summary: lo?.courseTitle,
        title: lo?.courseTitle,
        summaryEx: lo?.title + " (" + lo?.type + ")",
        img: lo?.img,
        icon: lo?.icon
      }}
    />
  {/each}
</div>
