<script lang="ts">
  import { studentsOnlineList } from "$lib/stores";
  import PrimaryStudentCard from "./PrimaryStudentCard.svelte";
</script>

<div class="flex flex-wrap justify-center">
  {#each $studentsOnlineList as studentLo}
    <PrimaryStudentCard lo={studentLo} />
  {/each}
</div>
