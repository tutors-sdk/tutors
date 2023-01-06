<script lang="ts">
  import { PrimaryStudentCard } from "tutors-ui";
  import { studentsOnlineList } from "tutors-reader-lib/src/stores/stores";
</script>

  <div class="flex flex-wrap justify-center">
    {#each $studentsOnlineList as studentLo}
      <PrimaryStudentCard lo="{studentLo}" />
    {/each}
  </div>
