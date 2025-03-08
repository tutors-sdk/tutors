<script lang="ts">
  import { currentLo } from "$lib/runes.svelte";
  import type { Lo } from "$lib/services/base";
  import Image from "../../components/Image.svelte";
  import LoContext from "../structure/LoContext.svelte";
  import { onMount } from "svelte";

  interface Props {
    loContext: Lo;
  }
  let { loContext }: Props = $props();

  let headingText = "text-md font-semibold";
  let cardWidths = "w-72";
</script>

<div class="card {cardWidths} preset-filled-primary-100-900 p-4">
  <h3 class="px-4 py-2 text-center {headingText}">{loContext?.title}</h3>
  <div class="card-body overflow-y-auto">
    <figure class="flex justify-center p-2">
      <!-- {#if currentLo?.value?.type !== "topic"}
        <Image lo={currentLo?.value} />
      {/if} -->
    </figure>
    <LoContext lo={loContext} />
  </div>
</div>
