<script lang="ts">
  import type { Lo } from "$lib/services/base/lo-types";
  import LoReference from "./LoReference.svelte";

  export let lo: Lo;
  if (lo?.toc) {
    lo?.toc.forEach((lo) => {
      if (lo?.route.endsWith("/")) {
        lo.route = lo?.route.slice(0, -1);
      }
    });
  }
  export let indent = 0;
</script>

{#each lo?.toc as lo}
  <LoReference {lo} indent={indent + 4} />
  {#if lo.toc}
    <svelte:self {lo} indent={indent + 4} />
  {/if}
{/each}
