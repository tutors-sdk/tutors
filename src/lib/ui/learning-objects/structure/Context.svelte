<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import { onMount, type Snippet } from "svelte";
  import LoContextPanel from "../layout/LoContextPanel.svelte";
  import { slideFromRight } from "$lib/ui/animations";
  import { fly } from "svelte/transition";

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

  let isLoaded = $state(false);
  onMount(() => {
    isLoaded = true;
  });
</script>

<div class="ml-10 mr-10 flex justify-between">
  <div class="w-full">
    {@render children()}
  </div>
  {#if loContext && isLoaded}
    <div in:fly={slideFromRight.in} out:fly={slideFromRight.out}>
      <div class="mr-2 hidden h-auto w-72 xl:block">
        <div class="sticky top-6 h-auto">
          <LoContextPanel {loContext} />
        </div>
      </div>
    </div>
  {/if}
</div>
