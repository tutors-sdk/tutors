<script lang="ts">
  import { studentsOnlineList } from "$lib/stores";
  import StudentCard from "./StudentCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each $studentsOnlineList as lo}
    <StudentCard {lo} />
  {/each}
</div>
