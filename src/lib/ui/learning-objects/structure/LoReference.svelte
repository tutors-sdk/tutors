<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import Icon from "$lib/ui/components/Icon.svelte";

  export let lo: Lo;
  export let indent = 0;
  if (indent > 16) {
    indent = 16;
  }
</script>

<div class="flex py-1 ml-{indent}">
  <a href={lo?.route} class="flex">
    <Icon type={lo.type} />
    <span class="mb-1 ml-2"> {@html lo.title} </span>
  </a>
  {#if lo.video && lo.type != "panelvideo"}
    <a class="flex pl-4" href={lo.video}>
      <Icon type="video" />
    </a>
  {/if}
</div>
