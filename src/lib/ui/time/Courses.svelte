<script lang="ts">
  import { liveService } from "$lib/services/community";
  import Card from "../learning-objects/layout/Card.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each liveService.coursesOnline.value as lo}
    <Card
      cardDetails={{
        route: lo.loRoute,
        title: lo.courseTitle,
        type: lo.type,
        summary: lo.title,
        img: lo.img,
        icon: lo.icon
      }}
    />
  {/each}
</div>
