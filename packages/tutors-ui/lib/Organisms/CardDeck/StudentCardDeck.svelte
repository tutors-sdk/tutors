<script lang="ts">
  import { PrimaryStudentCard } from "tutors-ui";
  import { StudentLoEvent } from "tutors-reader-lib/src/types/metrics-types";
  export let los: StudentLoEvent[] = [];
</script>

{#if los.length}
  <div class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <PrimaryStudentCard lo="{lo}" />
      {/each}
    </div>
  </div>
{/if}
