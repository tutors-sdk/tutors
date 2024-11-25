<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import Card from "$lib/ui/themes/card/Card.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each presenceService.studentsOnline.value as lo}
    {#if lo?.user?.fullName !== "Anon"}
      <Card
        cardDetails={{
          route: lo?.loRoute,
          student: lo?.user,
          type: lo?.type,
          subtitle1: lo?.courseTitle,
          title: lo?.courseTitle,
          subtitle2: lo?.title + " (" + lo?.type + ")",
          img: lo?.img,
          icon: lo?.icon
        }}
      />
    {/if}
  {/each}
</div>
