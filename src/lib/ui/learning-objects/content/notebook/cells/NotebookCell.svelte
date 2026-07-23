<script lang="ts">
  import type { NotebookCell as NotebookCellType } from "@tutors/tutors-model-lib";
  import type { LiveNotebook } from "$lib/services/course";
  import NotebookSolutionCell from "./NotebookSolutionCell.svelte";
  import NotebookExerciseCell from "./NotebookExerciseCell.svelte";
  import NotebookCodeCell from "./NotebookCodeCell.svelte";
  import NotebookMarkdownCell from "./NotebookMarkdownCell.svelte";
  import NotebookRawCell from "./NotebookRawCell.svelte";

  interface Props {
    cell: NotebookCellType;
    index: number;
    notebook: LiveNotebook;
    isActive: boolean;
    outputRevealed: boolean;
    solutionRevealed: boolean;
    onToggleOutput: () => void;
    onToggleSolution: () => void;
    onClick: () => void;
    kernelLanguage?: string;
  }

  let {
    cell,
    index,
    notebook,
    isActive,
    outputRevealed,
    solutionRevealed,
    onToggleOutput,
    onToggleSolution,
    onClick,
    kernelLanguage = "python"
  }: Props = $props();
</script>

<div
  id="notebook-cell-{index}"
  class="notebook-cell mb-2 rounded-lg border transition-colors
    {isActive
      ? 'border-primary-300 dark:border-primary-600'
      : 'border-surface-200 dark:border-surface-700'}"
  role="button"
  tabindex="-1"
  onclick={onClick}
  onkeydown={() => {}}
>
  {#if notebook.isSolutionCell(cell)}
    <NotebookSolutionCell
      {cell}
      {index}
      {solutionRevealed}
      outputRevealed={outputRevealed}
      onToggleSolution={onToggleSolution}
      onToggleOutput={onToggleOutput}
    />
  {:else if notebook.isExerciseCell(cell)}
    <NotebookExerciseCell {cell} {kernelLanguage} />
  {:else if cell.cellType === "code"}
    <NotebookCodeCell
      {cell}
      {index}
      revealed={outputRevealed}
      onToggleOutput={onToggleOutput}
    />
  {:else if cell.cellType === "markdown"}
    <NotebookMarkdownCell {cell} />
  {:else}
    <NotebookRawCell {cell} />
  {/if}
</div>
