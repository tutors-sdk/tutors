<script lang="ts">
  import { currentLo } from "$lib/runes.svelte";
  import type { Lo } from "@tutors/tutors-model-lib";
  import Image from "../../components/Image.svelte";
  import LoContext from "../structure/LoContext.svelte";
    import LoContextTree from "../structure/LoContextTree.svelte";

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
    <figure class="flex h-44 justify-center p-2">
      <Image lo={currentLo?.value} />
    </figure>
    <LoContextTree lo={loContext} />
  </div>
</div>
