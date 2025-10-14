<script lang="ts">
  import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";
  import Icon from "./Icon.svelte";

  let { position = "left", menuSelector, sidebarContent } = $props();

  let openState = $state(false);
  function popoverClose() {
    openState = false;
  }
  let positionerJustify = $state("justify-start");
  let transitionInOut = $state(-480);
  if (position === "right") {
    positionerJustify = "justify-end";
    transitionInOut = 480;
  }
</script>

<Dialog>
  <Dialog.Trigger class="btn preset-filled">
    {@render menuSelector()}
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop class="bg-surface-50-950/50 fixed inset-0 z-50 opacity-0 transition transition-discrete data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0" />
    <Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
      <Dialog.Content
        class="card bg-surface-100-900 h-screen w-sm -translate-x-full space-y-4 p-4 opacity-0 shadow-xl transition transition-discrete data-[state=open]:translate-x-0 data-[state=open]:opacity-100 starting:data-[state=open]:-translate-x-full starting:data-[state=open]:opacity-0"
      >
        <div class="relative h-full">
          <button class="btn-icon hover:preset-tonal absolute top-0 right-0 z-10" onclick={popoverClose}>
            <Icon type="close" />
          </button>
          <div class="h-full overflow-y-auto">
            {@render sidebarContent()}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>

<!-- <Dialog
  open={openState}
  onOpenChange={(e) => (openState = e.open)}
  triggerBase="btn"
  contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
  {positionerJustify}
  positionerAlign=""
  positionerPadding=""
  transitionsPositionerIn={{ x: transitionInOut, duration: 200 }}
  transitionsPositionerOut={{ x: transitionInOut, duration: 200 }}
>
  {#snippet trigger()}
    {@render menuSelector()}
  {/snippet}
  {#snippet content()}
    <div class="relative h-full">
      <button class="btn-icon hover:preset-tonal absolute top-0 right-0 z-10" onclick={popoverClose}>
        <Icon type="close" />
      </button>
      <div class="h-full overflow-y-auto">
        {@render sidebarContent()}
      </div>
    </div>
  {/snippet}
</Dialog> -->
