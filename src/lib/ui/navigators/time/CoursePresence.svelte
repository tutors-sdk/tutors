<script lang="ts">
  import { presenceService } from "$lib/services/presence.svelte";
  import StudentCard from "./StudentCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each presenceService.studentsOnline.value as lo}
    {#if lo?.user?.fullName !== "Anon"}
      <StudentCard {lo} />
    {/if}
  {/each}
</div>
