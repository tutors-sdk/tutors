<script lang="ts">
  import { PrimaryStudentCard } from "tutors-ui";
  import { studentsOnline2, studentsOnlineList2 } from "tutors-reader-lib/src/stores/stores";
</script>

<div class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur">
  <div class="flex flex-wrap justify-center">
    {#each $studentsOnlineList2 as studentLo}
      <PrimaryStudentCard lo="{studentLo}" />
    {/each}
  </div>
</div>
