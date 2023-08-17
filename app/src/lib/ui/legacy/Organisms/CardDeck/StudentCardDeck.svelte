<script lang="ts">
  import { PrimaryStudentCard } from "$lib/ui/legacy";
  import { studentsOnlineList } from "$lib/stores";
</script>

<div class="flex flex-wrap justify-center">
  {#each $studentsOnlineList as studentLo}
    <PrimaryStudentCard lo={studentLo} />
  {/each}
</div>
