<script lang="ts">
  import { allStudentsOnlineList } from "$lib/stores";
  import StudentCard from "./StudentCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each $allStudentsOnlineList as lo}
    <StudentCard {lo} />
  {/each}
</div>
