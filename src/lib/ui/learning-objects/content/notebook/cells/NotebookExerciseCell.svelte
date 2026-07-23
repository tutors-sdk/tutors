<script lang="ts">
  import type { NotebookCell } from "@tutors/tutors-model-lib";
  import NotebookCodeEditor from "../NotebookCodeEditor.svelte";

  interface Props {
    cell: NotebookCell;
    kernelLanguage?: string;
  }
  let { cell, kernelLanguage = "python" }: Props = $props();
</script>

<div class="exercise-cell">
  <div class="flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-950 border-b border-surface-200 dark:border-surface-700">
    <span class="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Exercise</span>
  </div>
  <div class="flex">
    <div class="flex-shrink-0 w-14 pt-3 text-right pr-2 font-mono text-xs text-surface-400 select-none">
      [{cell.executionCount ?? " "}]:
    </div>
    <div class="flex-1 min-w-0 overflow-x-auto">
      <NotebookCodeEditor source={cell.source} language={kernelLanguage} />
    </div>
  </div>
</div>
