<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import LoReference from "./LoReference.svelte";
  import Self from "./LoContext.svelte";

  let { lo, indent = 0 }: { lo: Lo; indent: number } = $props();
  
  if (lo?.toc) {
    lo.toc.forEach((child: Lo) => {
      if (child.route.endsWith("/")) {
        child.route = child.route.slice(0, -1);
      }
      if ((child.type === "unit" || child.type === "side") && child.parentLo?.type === "course") {
        lo.route = lo.route.replace("topic", "course");
      }
    });
  }
</script>

{#each (lo as any)?.toc as childLo}
  <LoReference lo={childLo} indent={indent + 2} />
  {#if childLo?.toc}
    <Self lo={childLo} indent={indent + 2} />
  {/if}
{/each}
