<script lang="ts">
  import type { NotebookCell } from "@tutors/tutors-model-lib";

  interface Props {
    cell: NotebookCell;
    index: number;
    revealed: boolean;
    onToggleOutput: () => void;
  }
  let { cell, index, revealed, onToggleOutput }: Props = $props();
</script>

<div class="flex">
  <div class="flex-shrink-0 w-14 pt-3 text-right pr-2 font-mono text-xs text-surface-400 select-none">
    [{cell.executionCount ?? " "}]:
  </div>
  <div class="flex-1 min-w-0 overflow-x-auto">
    <div class="notebook-code-source prose dark:prose-invert prose-pre:overflow-x-auto max-w-none">
      {@html cell.sourceHtml ?? ""}
    </div>
    {#if cell.outputsHtml}
      <div class="flex items-center border-t border-surface-200 dark:border-surface-700 px-3 py-1.5">
        <button
          class="run-button flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors
            {revealed
              ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
              : 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 hover:bg-success-200 dark:hover:bg-success-800'}"
          onclick={(e) => { e.stopPropagation(); onToggleOutput(); }}
        >
          <span class="text-sm">{revealed ? "▾" : "▸"}</span>
          {revealed ? "Hide Output" : "Run"}
        </button>
      </div>
      {#if revealed}
        <div class="notebook-outputs border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3">
          {@html cell.outputsHtml}
        </div>
      {/if}
    {/if}
  </div>
</div>
