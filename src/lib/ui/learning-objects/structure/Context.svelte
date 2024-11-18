<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import type { Snippet } from "svelte";
  import LoContextPanel from "../layout/LoContextPanel.svelte";

  type Props = {
    children: Snippet;
    lo: Lo;
  };
  let { children, lo }: Props = $props();

  // svelte-ignore non_reactive_update
  let loContext = lo;
  if (loContext) {
    while (loContext.type !== "topic" && loContext.type !== "course") {
      loContext = loContext.parentLo!;
    }
  }
</script>

<div class="ml-10 mr-10 flex justify-between">
  <div class="w-full">
    {@render children()}
  </div>
  {#if loContext}
    <div class="mr-2 hidden h-auto w-72 xl:block">
      <div class="sticky top-6 h-auto">
        <LoContextPanel {loContext} />
      </div>
    </div>
  {/if}
</div>
