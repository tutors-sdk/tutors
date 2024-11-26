<script lang="ts">
  import { currentCourse } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";
  import { Modal } from "@skeletonlabs/skeleton-svelte";

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

<Modal
  bind:open={openState}
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
    <div class="relative">
      <button class="btn-icon absolute right-0 top-0 hover:preset-tonal" onclick={popoverClose}>
        <Icon type="close" />
      </button>
      {@render sidebarContent()}
    </div>
  {/snippet}
</Modal>
