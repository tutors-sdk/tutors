<script lang="ts">
  import { onlineDrawer, studentsOnline, studentsOnlineList } from "../../../stores";
  import StudentCard from "../../cards/StudentCard.svelte";

  const drawerClose: any = () => { onlineDrawer.set(false) };
</script>

<div class="text-right mt-4 mr-4">
<button class="btn btn-square bg-primary-500" on:click={drawerClose}>X</button>
</div>
<div class="px-12 py-4">
  <div class="flex flex-wrap">
    {#if $studentsOnline == 0}
      <span class="text-lg">No students currently online...</span>
    {/if}
    <div class="flex flex-wrap justify-center w-full">
    {#each $studentsOnlineList as student}
      <StudentCard {student} />
    {/each}
    </div>
  </div>
</div>
