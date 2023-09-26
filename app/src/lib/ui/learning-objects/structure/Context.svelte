<script lang="ts">
  import type { Lo } from "$lib/services/models/lo-types";
  import TopicContextPanel from "../layout/TopicContextPanel.svelte";
  export let lo: Lo;
</script>

<div class="flex w-11/12 mx-auto">
  <div class="w-full">
    {#key lo}
      <slot />
    {/key}
  </div>
  <div class="hidden md:block">
    <TopicContextPanel topic={lo.parentTopic} />
  </div>
</div>
