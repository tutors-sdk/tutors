<script lang="ts">
  import { studentsOnlineList } from "./stores";
  import StudentCard from "./StudentCard.svelte";
</script>

<div class="bg-surface-100-800-token mx-auto mb-2 place-items-center overflow-hidden rounded-xl p-4">
  <div class="flex flex-wrap justify-center">
    {#each $studentsOnlineList as studentLo}
      <StudentCard lo={studentLo} />
    {/each}
  </div>
</div>
