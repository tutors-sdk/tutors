<script lang="ts">
  import { currentCourse } from "$lib/runes.svelte";
  import LoContextTree from "./LoContextTree.svelte";
</script>

<div class=" max-h-[90vh] overflow-y-auto">
  <LoContextTree lo={currentCourse?.value} expandState="expanded" />
</div>
