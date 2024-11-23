<script lang="ts">
  import CourseContext from "$lib/ui/learning-objects/structure/CourseContext.svelte";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  import { Modal } from "@skeletonlabs/skeleton-svelte";

  let drawerState = $state(false);

  function drawerClose() {
    drawerState = false;
  }
</script>

<Modal
  bind:open={drawerState}
  triggerBase="btn preset-tonal"
  contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
  positionerJustify="justify-end"
  positionerAlign=""
  positionerPadding=""
  transitionsPositionerIn={{ x: 480, duration: 200 }}
  transitionsPositionerOut={{ x: 480, duration: 200 }}
>
  {#snippet trigger()}
    <button class="btn btn-sm" title="Open course table of contents">
      <span class="inline-flex gap-2 text-sm font-bold">
        <Icon icon="fluent:line-horizontal-3-20-filled" color="rgba(var(--color-primary-500))" height="20" />
      </span>
    </button>
  {/snippet}
  {#snippet content()}
    <header class="flex justify-between">
      <h2 class="h2">Table of Contents</h2>
    </header>
    <article>
      <CourseContext />
    </article>
    <footer>
      <button type="button" class="btn preset-filled" onclick={drawerClose}>Close</button>
    </footer>
  {/snippet}
</Modal>
