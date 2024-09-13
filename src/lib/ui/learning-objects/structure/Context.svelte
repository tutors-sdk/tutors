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

<div class="flex w-11/12 mx-auto">
  <div class="w-full">
    {#key lo}
      <slot />
    {/key}
  </div>
  {#if loContext}
    <div class="hidden md:block">
      <LoContextPanel {loContext} />
    </div>
  {/if}
</div>
