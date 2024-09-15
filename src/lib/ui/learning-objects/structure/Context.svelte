<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import LoContextPanel from "../layout/LoContextPanel.svelte";
  export let lo: Lo;
  let loContext = lo;
  if (loContext) {
    while (loContext.type !== "topic" && loContext.type !== "course") {
      loContext = loContext.parentLo!;
    }
  }
</script>

<div class="flex justify-between ml-10 mr-10">
  <div class="w-full">
    {#key lo}
      <slot />
    {/key}
  </div>
  {#if loContext}
    <div class="hidden xl:block">
      <LoContextPanel {loContext} />
    </div>
  {/if}
</div>
