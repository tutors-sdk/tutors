<script lang="ts">
  import type { Lo } from "$lib/services/course/models/lo-types";
  import Icon from "$lib/ui/components/Icon.svelte";

  export let lo: Lo;
  export let indent = 0;
  if (indent > 16) {
    indent = 16;
  }
</script>

<a href={lo?.route} class="flex py-1 ml-{indent}">
  <Icon type={lo.type} />
  <span class="mb-1 ml-2"> {@html lo.title} </span>
  {#if lo.video && lo.type != "panelvideo"}
    <a class="flex pl-4" href={lo.video}>
      <Icon type="video" />
    </a>
  {/if}
</a>
