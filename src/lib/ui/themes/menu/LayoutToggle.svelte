<script lang="ts">
  import { layout } from "$lib/runes";
  import Icon from "$lib/ui/themes/icons/Icon.svelte";

  function toggleLayout() {
    if (layout.value === "compacted") {
      layout.value = "expanded";
    } else {
      layout.value = "compacted";
    }
  }
</script>

<button class="btn flex w-full justify-between" onclick={toggleLayout}>
  <span class="flex-none">{layout.value === "compacted" ? "Expand" : "Compact"}</span>
  <Icon type={layout.value} />
</button>
