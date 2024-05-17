<script lang="ts">
  import { layout } from "$lib/stores";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  function toggleLayout() {
    if ($layout === "compacted") {
      layout.set("expanded");
    } else {
      layout.set("compacted");
    }
  }
</script>

<button class="btn w-full flex justify-between" on:click={toggleLayout}>
  <span class="flex-none">Compact</span>
  <Icon type={$layout} />
</button>
