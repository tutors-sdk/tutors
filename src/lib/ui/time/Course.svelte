<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import Card from "../components/Card.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each presenceService.studentsOnline.value as lo}
    <Card
      cardDetails={{
        route: lo.loRoute,
        title: lo.courseTitle,
        type: lo.type,
        summary: lo.title,
        summaryEx: "(" + lo.type + ")",
        img: lo.img,
        icon: lo.icon
      }}
    />
  {/each}
</div>
