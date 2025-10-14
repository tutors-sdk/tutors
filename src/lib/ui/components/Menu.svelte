<script lang="ts">
  import { Popover, Portal } from "@skeletonlabs/skeleton-svelte";
  // import MenuItem from "./MenuItem.svelte";

  let { menuSelector, menuContent } = $props();

  // let openState = $state(false);
</script>

<Popover>
  <Popover.Trigger>{@render menuSelector()}</Popover.Trigger>
  <Portal>
    <Popover.Positioner>
      <Popover.Content class="card  bg-surface-50 z-999 m-4 max-w-[500px] space-y-4">
        <Popover.Description>
          <nav class="card-body list-nav card w-56 w-full space-y-2 bg-gray-100 p-2 shadow-lg dark:bg-gray-800">
            {@render menuContent()}
          </nav>
        </Popover.Description>
      </Popover.Content>
    </Popover.Positioner>
  </Portal>
</Popover>

<!-- <Popover
  open={openState}
  onOpenChange={(e) => (openState = e.open)}
  positioning={{ placement: "top" }}
  triggerBase="btn"
  contentBase="card  bg-surface-50 m-4 space-y-4 max-w-[500px] z-9999"
>
  {#snippet trigger()}
    {@render menuSelector()}
  {/snippet}
  {#snippet content()}
    <nav class="card-body list-nav card w-56 w-full space-y-2 bg-gray-100 p-2 shadow-lg dark:bg-gray-800">
      {@render menuContent()}
    </nav>
  {/snippet}
</Popover> -->
