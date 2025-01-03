<script lang="ts">
  import { Popover } from "@skeletonlabs/skeleton-svelte";

  let { menuSelector, menuContent } = $props();

  let openState = $state(false);
</script>

<Popover
  bind:open={openState}
  positioning={{ placement: "top" }}
  triggerBase="btn"
  class="z-[9999]"
  contentBase="card bg-surface-50 m-4 space-y-4 max-w-[320px] z-[9999]"
>
  {#snippet trigger()}
    {@render menuSelector()}
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 space-y-2 bg-gray-100 p-2 shadow-lg dark:bg-gray-800">
      {@render menuContent()}
    </nav>
  {/snippet}
</Popover>
