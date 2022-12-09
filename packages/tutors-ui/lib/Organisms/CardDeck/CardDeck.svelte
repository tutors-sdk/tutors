<script lang="ts">
  import { Card } from "tutors-ui";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let los: Lo[] = [];
  let orderedLos = los.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = los.filter((lo) => !lo?.frontMatter?.order);
  orderedLos.sort((a, b) => Number(a.frontMatter.order) - Number(b.frontMatter.order));
</script>

{#if los.length}
  <div class="bg-surface-100-800-token rounded-box card-corner mx-auto mb-2 w-11/12 max-w-full place-items-center overflow-hidden rounded-xl p-4 backdrop-blur">
    <div class="flex flex-wrap justify-center">
      {#each orderedLos as lo}
        <Card lo="{lo}" />
      {/each}
      {#each unOrderedLos as lo}
        <Card lo="{lo}" />
      {/each}
    </div>
  </div>
{/if}
