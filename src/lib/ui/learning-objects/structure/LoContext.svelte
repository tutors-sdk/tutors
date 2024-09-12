<script lang="ts">
  import type { Composite, Lo } from "$lib/services/models/lo-types";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { AccordionItem } from "@skeletonlabs/skeleton";
  import LoReference from "./LoReference.svelte";

  export let lo: Lo;
</script>

{#each lo?.toc as lo}
  <AccordionItem>
    <svelte:fragment slot="summary"><LoReference {lo} /></svelte:fragment>
    <svelte:fragment slot="content">
      {#if lo.toc}
        {#each lo?.toc as lo}
          <LoReference {lo} indent={4} />
          {#if lo.toc}
            {#each lo?.toc as lo}
              <LoReference {lo} indent={8} />
              {#if lo.toc}
                {#each lo?.toc as lo}
                  <LoReference {lo} indent={12} />
                {/each}
              {/if}
            {/each}
          {/if}
        {/each}
      {/if}
    </svelte:fragment>
  </AccordionItem>
{/each}
