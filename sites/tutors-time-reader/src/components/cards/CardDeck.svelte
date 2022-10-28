<script lang="ts">
  import Card from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let los: Lo[] = [];
</script>

{#if los.length}
  <div class="carddeck-bg">
    <div class="flex flex-wrap justify-center">
      {#each los as lo}
        <Card {lo} />
      {/each}
    </div>
  </div>
{/if}
