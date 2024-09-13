<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import LoReference from "./LoReference.svelte";

  export let lo: Lo;
  if (lo?.toc) {
    lo?.toc.forEach((lo) => {
      if (lo?.route.endsWith("/")) {
        lo.route = lo?.route.slice(0, -1);
      }
    });
  }
</script>

{#each lo?.toc as lo}
  <LoReference {lo} />
  {#if lo.toc}
    {#each lo?.toc as lo}
      <LoReference {lo} indent={4} />
      {#if lo.toc}
        {#each lo?.toc as lo}
          <LoReference {lo} indent={8} />
          {#if lo.toc}
            {#each lo?.toc as lo}
              <LoReference {lo} indent={12} />
              {#if lo.toc}
                {#each lo?.toc as lo}
                  <LoReference {lo} indent={16} />
                {/each}
              {/if}
            {/each}
          {/if}
        {/each}
      {/if}
    {/each}
  {/if}
{/each}
