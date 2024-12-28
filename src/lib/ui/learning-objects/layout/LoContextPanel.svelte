<script lang="ts">
  import { courseService } from "$lib/services/course.svelte";
  import type { Lo } from "$lib/services/models/lo-types";
  import Image from "../../components/Image.svelte";
  import LoContext from "../structure/LoContext.svelte";

  interface Props {
    loContext: Lo;
  }
  let { loContext }: Props = $props();

  let headingText = "text-md font-semibold";
  let cardWidths = "w-72";
</script>

<div class="card {cardWidths} p-4 preset-filled-primary-100-900">
  <h3 class="px-4 py-2 text-center {headingText}">{loContext?.title}</h3>
  <div class="card-body overflow-y-auto">
    <figure class="flex justify-center p-2">
      <Image lo={courseService.currentLo?.value} />
    </figure>
    <LoContext lo={loContext} />
  </div>
</div>
