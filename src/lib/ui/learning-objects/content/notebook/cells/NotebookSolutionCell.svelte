<script lang="ts">
  import type { NotebookCell } from "$lib/types/notebook-types";

  interface Props {
    cell: NotebookCell;
    index: number;
    solutionRevealed: boolean;
    outputRevealed: boolean;
    onToggleSolution: () => void;
    onToggleOutput: () => void;
  }
  let { cell, index, solutionRevealed, outputRevealed, onToggleSolution, onToggleOutput }: Props = $props();
</script>

<div class="solution-cell">
  <button
    class="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
      {solutionRevealed
        ? 'bg-tertiary-100 dark:bg-tertiary-900 text-tertiary-700 dark:text-tertiary-300'
        : 'bg-tertiary-50 dark:bg-tertiary-950 text-tertiary-600 dark:text-tertiary-400 hover:bg-tertiary-100 dark:hover:bg-tertiary-900'}"
    onclick={(e) => { e.stopPropagation(); onToggleSolution(); }}
  >
    <span class="text-base">{solutionRevealed ? "▾" : "▸"}</span>
    <span>{solutionRevealed ? "Hide Solution" : "Show Solution"}</span>
  </button>
  {#if solutionRevealed}
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
                {outputRevealed
                  ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                  : 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 hover:bg-success-200 dark:hover:bg-success-800'}"
              onclick={(e) => { e.stopPropagation(); onToggleOutput(); }}
            >
              <span class="text-sm">{outputRevealed ? "▾" : "▸"}</span>
              {outputRevealed ? "Hide Output" : "Run"}
            </button>
          </div>
          {#if outputRevealed}
            <div class="notebook-outputs border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3">
              {@html cell.outputsHtml}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</div>
