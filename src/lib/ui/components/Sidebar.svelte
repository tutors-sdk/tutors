<script lang="ts">
  import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";
  import Icon from "./Icon.svelte";

  let { position = "left", menuSelector, sidebarContent } = $props();

  let positionerJustify = $state(position === "right" ? "justify-end" : "justify-start");
  let contentTranslate = $state(
    position === "right"
      ? "translate-x-full data-[state=open]:translate-x-0 starting:data-[state=open]:translate-x-full"
      : "-translate-x-full data-[state=open]:translate-x-0 starting:data-[state=open]:-translate-x-full"
  );
</script>

<Dialog>
  <Dialog.Trigger>
    {@render menuSelector()}
  </Dialog.Trigger>
  <Portal>
    <Dialog.Backdrop class="bg-surface-100-900 h-screen w-[480px] shadow-xl" />
    <Dialog.Positioner class={`fixed inset-0 z-50 flex ${positionerJustify} z-9999`}>
      <Dialog.Content
        class={`card bg-surface-100-900 overflow-y-scroll h-screen w-sm space-y-4 p-4 opacity-0 shadow-xl transition transition-discrete ${contentTranslate} data-[state=open]:opacity-100 starting:data-[state=open]:opacity-0`}
      >
        <header class="flex items-center justify-end">
          <Dialog.CloseTrigger class="btn-icon preset-tonal"><Icon type="close" /></Dialog.CloseTrigger>
        </header>
        {@render sidebarContent()}
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>
