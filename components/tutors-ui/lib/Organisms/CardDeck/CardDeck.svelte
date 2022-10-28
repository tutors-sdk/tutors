<script lang="ts">
  import { Card } from 'tutors-ui';
  import type { Lo } from 'tutors-reader-lib/src/types/lo-types';

  export let los: Lo[] = [];
  let orderedLos = los.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = los.filter((lo) => !lo?.frontMatter?.order);
  orderedLos.sort((a, b) => Number(a.frontMatter.order) - Number(b.frontMatter.order));
</script>

{#if los.length}
  <div class="flex flex-wrap justify-center">
    {#each orderedLos as lo}
      <Card lo="{lo}" />
    {/each}
    {#each unOrderedLos as lo}
      <Card lo="{lo}" />
    {/each}
  </div>
{/if}
