<script lang="ts">
  import Card from "./Card.svelte";
  import type { Lo } from "tutors-reader-lib/src/types/lo-types";

  export let los: Lo[] = [];
  let orderedLos = los.filter((lo) => lo?.frontMatter?.order);
  let unOrderedLos = los.filter((lo) => !(lo?.frontMatter?.order));
  orderedLos.sort((a, b) => a.frontMatter.order - b.frontMatter.order);
</script>

{#if los.length}
  <div class="carddeck-bg">
    <div class="flex flex-wrap justify-center">
      {#each orderedLos as lo}
        <Card {lo} />
      {/each}
      {#each unOrderedLos as lo}
        <Card {lo} />
      {/each}
    </div>
  </div>
{/if}
