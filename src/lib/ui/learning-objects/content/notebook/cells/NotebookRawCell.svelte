<script lang="ts">
  import type { NotebookCell } from "@tutors/tutors-model-lib";

  interface Props {
    cell: NotebookCell;
  }
  let { cell }: Props = $props();
</script>

<div class="p-4">
  <pre class="text-sm font-mono whitespace-pre-wrap">{cell.source}</pre>
</div>
