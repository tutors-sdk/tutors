<script lang="ts">
  import CourseContext from "$lib/ui/learning-objects/structure/CourseContext.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  import { Modal } from "@skeletonlabs/skeleton-svelte";

  let openState = $state(false);

  function popoverClose() {
    openState = false;
  }
</script>

<Modal
  bind:open={openState}
  triggerBase="btn"
  contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
  positionerJustify="justify-end"
  positionerAlign=""
  positionerPadding=""
  transitionsPositionerIn={{ x: 480, duration: 200 }}
  transitionsPositionerOut={{ x: 480, duration: 200 }}
>
  {#snippet trigger()}
    <Icon type="toc" tip="Open course Table of Contents" />
  {/snippet}
  {#snippet content()}
    <button class="btn-icon absolute right-0 top-0 hover:preset-tonal" onclick={popoverClose}>
      <Icon type="close" />
    </button>
    <header class="flex justify-between">
      <h2 class="h2">Table of Contents</h2>
    </header>
    <article>
      <CourseContext />
    </article>
  {/snippet}
</Modal>
