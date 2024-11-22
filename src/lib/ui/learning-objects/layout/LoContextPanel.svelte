<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import Image from "../../themes/Image.svelte";
  import LoContext from "../structure/LoContext.svelte";

  export let loContext: Lo;

  let headingText = "text-md font-semibold";
  let cardWidths = "w-72";
  let lo: Lo;
</script>

<div class="card {cardWidths} px-4 py-2">
  <h3 class="px-4 py-2 text-center {headingText}">{loContext?.title}</h3>
  <div class="card-body">
    <figure class="flex justify-center p-2">
      <Image {lo} />
    </figure>
    <LoContext lo={loContext} />
  </div>
</div>
