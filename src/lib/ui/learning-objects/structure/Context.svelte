<script lang="ts">
  import type { Lo } from "$lib/services/base";
  import { onMount, type Snippet } from "svelte";
  import LoContextPanel from "../layout/LoContextPanel.svelte";
  import { slideFromRight } from "$lib/ui/navigators/animations";
  import { fly } from "svelte/transition";
  import Breadcrumbs from "$lib/ui/navigators/buttons/Breadcrumbs.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";

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

<SecondaryNavigator {lo} parentCourse={lo?.parentCourse?.properties?.parent} />
<div class="mr-10 ml-10 flex justify-between">
  <div class="w-full">
    {@render children()}
  </div>
  {#if loContext && isLoaded}
    <div in:fly={slideFromRight.in} out:fly={slideFromRight.out} class="mr-2 hidden h-auto w-72 xl:block">
      <div class="sticky top-14 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <LoContextPanel {loContext} />
      </div>
    </div>
  {/if}
</div>
