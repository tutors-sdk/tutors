<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import Image from "../../themes/Image.svelte";
  import LoContext from "../structure/LoContext.svelte";

  interface Props {
    loContext: Lo;
  }
  import { currentLo } from "$lib/runes";
  let { loContext }: Props = $props();

  let headingText = "text-md font-semibold";
  let cardWidths = "w-72";
</script>

<div class="card {cardWidths} dark:bg-surface-950px-4 bg-surface-100 p-4">
  <h3 class="px-4 py-2 text-center {headingText}">{loContext?.title}</h3>
  <div class="card-body">
    <figure class="flex justify-center p-2">
      <Image lo={currentLo?.value} />
    </figure>
    <LoContext lo={loContext} />
  </div>
</div>
