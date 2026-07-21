<script lang="ts">
  import type { NotebookCell } from "$lib/types/notebook-types";

  interface Props {
    cell: NotebookCell;
  }
  let { cell }: Props = $props();
</script>

<div class="p-4">
  <article class="prose dark:prose-invert max-w-none">
    {@html cell.sourceHtml ?? ""}
  </article>
</div>
