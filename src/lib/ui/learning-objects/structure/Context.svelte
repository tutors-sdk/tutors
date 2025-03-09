<script lang="ts">
  import type { Lo } from "$lib/services/base";
  import { onMount, type Snippet } from "svelte";
  import LoContextPanel from "../layout/LoContextPanel.svelte";
  import { slideFromRight } from "$lib/ui/navigators/animations";
  import { fly } from "svelte/transition";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import Image from "../../components/Image.svelte";
  import { currentLo } from "$lib/runes.svelte";

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
      <div class="sticky top-14 flex flex-col overflow-y-auto">
        <div class="my-auto">
          <LoContextPanel {loContext} />
        </div>
      </div>
    </div>
  {/if}
</div>
