<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import LoReference from "./LoReference.svelte";
  import Self from "./LoContext.svelte";

  let { lo, indent = 0 }: { lo: Lo; indent: number } = $props();

  if (lo?.toc) {
    lo?.toc?.forEach((lo) => {
      if (lo?.route.endsWith("/")) {
        lo.route = lo?.route.slice(0, -1);
      }
      if ((lo?.type === "unit" || lo?.type === "side") && lo?.parentLo?.type === "course") {
        lo.route = lo.route.replace("topic", "course");
      }
    });
  }
</script>

{#each lo?.toc as lo}
  <LoReference {lo} indent={indent + 2} />
  {#if lo?.toc}
    <Self {lo} indent={indent + 2} />
  {/if}
{/each}
