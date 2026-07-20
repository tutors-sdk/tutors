<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { currentCodeTheme } from "$lib/services/markdown";
  import type { Lo } from "@tutors/tutors-model-lib";
  import NotebookCodeEditor from "./NotebookCodeEditor.svelte";

  interface NotebookOutput {
    outputType: "stream" | "execute_result" | "display_data" | "error";
    text?: string;
    data?: Record<string, string>;
    traceback?: string[];
    name?: string;
    executionCount?: number | null;
  }

  interface NotebookCell {
    cellType: "markdown" | "code" | "raw";
    source: string;
    sourceHtml?: string;
    outputs: NotebookOutput[];
    outputsHtml?: string;
    executionCount: number | null;
    metadata: Record<string, unknown>;
    id: string;
  }

  interface NotebookLo extends Lo {
    cells?: NotebookCell[];
    kernelLanguage?: string;
  }

  interface Props {
    lo: NotebookLo;
  }
  let { lo }: Props = $props();

  let activeCellIndex = $state(0);
  let loaded = false;
  let revealedOutputs: Record<number, boolean> = $state({});
  let revealedSolutions: Record<number, boolean> = $state({});

  function isSolutionCell(cell: NotebookCell): boolean {
    const tags = cell.metadata?.tags;
    return Array.isArray(tags) && tags.includes("solution");
  }

  function isExerciseCell(cell: NotebookCell): boolean {
    const tags = cell.metadata?.tags;
    return Array.isArray(tags) && tags.includes("exercise");
  }

  function toggleSolution(index: number) {
    revealedSolutions[index] = !revealedSolutions[index];
  }

  const cells = $derived(lo.cells ?? []);
  const cellCount = $derived(cells.length);

  function toggleOutput(index: number) {
    revealedOutputs[index] = !revealedOutputs[index];
  }

  function scrollToCell(index: number) {
    const el = document.getElementById(`notebook-cell-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      if (activeCellIndex < cellCount - 1) {
        activeCellIndex++;
        scrollToCell(activeCellIndex);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      if (activeCellIndex > 0) {
        activeCellIndex--;
        scrollToCell(activeCellIndex);
      }
    }
  }

  onMount(() => {
    window.addEventListener("keydown", keypressInput);
  });

  onDestroy(() => {
    browser ? window.removeEventListener("keydown", keypressInput) : null;
  });

  afterNavigate(() => {
    if (!loaded) {
      loaded = true;
      return;
    }
    const elemPage = document.querySelector("#notebook-panel");
    if (elemPage && window.innerWidth >= 600) {
      elemPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  function getCellLabel(cell: NotebookCell, index: number): string {
    if (cell.cellType === "code") {
      return `[${cell.executionCount ?? " "}]`;
    }
    if (cell.cellType === "markdown") {
      const firstLine = cell.source.split("\n")[0].replace(/^#+\s*/, "").trim();
      return firstLine.length > 30 ? firstLine.slice(0, 30) + "..." : firstLine || `Cell ${index + 1}`;
    }
    return `Cell ${index + 1}`;
  }

  function getCellTypeIcon(cellType: string): string {
    switch (cellType) {
      case "code":
        return "terminal";
      case "markdown":
        return "document";
      default:
        return "text";
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
    integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="notebook-content w-full pb-14">
  <div class="max-w-l flex">
    <!-- Sidebar navigation -->
    <div class="mr-2 hidden h-auto w-72 lg:block">
      <div
        class="card bg-surface-100 border-primary-100 dark:border-primary-500 dark:bg-surface-950 sticky top-14 m-2 h-auto max-h-[80vh] overflow-y-auto rounded-xl border-[1px] py-4"
      >
        <nav class="nav-list">
          <ul>
            {#each cells as cell, i}
              <li>
                <button
                  class="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors
                    {activeCellIndex === i ? 'bg-primary-100 dark:bg-primary-900 font-semibold' : ''}"
                  onclick={() => { activeCellIndex = i; scrollToCell(i); }}
                >
                  <span class="flex items-center gap-2">
                    <span class="text-xs opacity-60 font-mono">
                      {#if isSolutionCell(cell)}
                        <span class="text-tertiary-500">&#128274;</span>
                      {:else if isExerciseCell(cell)}
                        <span class="text-primary-500">&#9998;</span>
                      {:else if cell.cellType === "code"}
                        <span class="text-warning-500">&#9654;</span>
                      {:else if cell.cellType === "markdown"}
                        <span class="text-success-500">&#182;</span>
                      {:else}
                        <span class="text-surface-500">&#9644;</span>
                      {/if}
                    </span>
                    <span class="truncate">{isSolutionCell(cell) ? "Solution" : getCellLabel(cell, i)}</span>
                  </span>
                </button>
              </li>
            {/each}
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <div class="min-h-screen flex-1">
      <div id="notebook-panel" class="mt-[-60px] block pt-[60px]">
        {#key currentCodeTheme.value}
          {#each cells as cell, i}
            <div
              id="notebook-cell-{i}"
              class="notebook-cell mb-2 rounded-lg border transition-colors
                {activeCellIndex === i
                  ? 'border-primary-300 dark:border-primary-600'
                  : 'border-surface-200 dark:border-surface-700'}"
              role="button"
              tabindex="-1"
              onclick={() => { activeCellIndex = i; }}
              onkeydown={() => {}}
            >
              {#if isSolutionCell(cell)}
                <!-- Solution cell: two-stage reveal (code first, then output) -->
                <div class="solution-cell">
                  <button
                    class="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
                      {revealedSolutions[i]
                        ? 'bg-tertiary-100 dark:bg-tertiary-900 text-tertiary-700 dark:text-tertiary-300'
                        : 'bg-tertiary-50 dark:bg-tertiary-950 text-tertiary-600 dark:text-tertiary-400 hover:bg-tertiary-100 dark:hover:bg-tertiary-900'}"
                    onclick={(e) => { e.stopPropagation(); toggleSolution(i); }}
                  >
                    <span class="text-base">{revealedSolutions[i] ? "▾" : "▸"}</span>
                    <span>{revealedSolutions[i] ? "Hide Solution" : "Show Solution"}</span>
                  </button>
                  {#if revealedSolutions[i]}
                    <div class="flex">
                      <div class="flex-shrink-0 w-14 pt-3 text-right pr-2 font-mono text-xs text-surface-400 select-none">
                        [{cell.executionCount ?? " "}]:
                      </div>
                      <div class="flex-1 min-w-0 overflow-x-auto">
                        <div class="notebook-code-source">
                          {@html cell.sourceHtml ?? ""}
                        </div>
                        {#if cell.outputsHtml}
                          <div class="flex items-center border-t border-surface-200 dark:border-surface-700 px-3 py-1.5">
                            <button
                              class="run-button flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors
                                {revealedOutputs[i]
                                  ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                                  : 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 hover:bg-success-200 dark:hover:bg-success-800'}"
                              onclick={(e) => { e.stopPropagation(); toggleOutput(i); }}
                            >
                              <span class="text-sm">{revealedOutputs[i] ? "▾" : "▸"}</span>
                              {revealedOutputs[i] ? "Hide Output" : "Run"}
                            </button>
                          </div>
                          {#if revealedOutputs[i]}
                            <div class="notebook-outputs border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3">
                              {@html cell.outputsHtml}
                            </div>
                          {/if}
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>

              {:else if isExerciseCell(cell)}
                <!-- Exercise cell (editable) -->
                <div class="exercise-cell">
                  <div class="flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-950 border-b border-surface-200 dark:border-surface-700">
                    <span class="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Exercise</span>
                  </div>
                  <div class="flex">
                    <div class="flex-shrink-0 w-14 pt-3 text-right pr-2 font-mono text-xs text-surface-400 select-none">
                      [{cell.executionCount ?? " "}]:
                    </div>
                    <div class="flex-1 min-w-0 overflow-x-auto">
                      <NotebookCodeEditor source={cell.source} language={lo.kernelLanguage ?? "python"} />
                    </div>
                  </div>
                </div>

              {:else if cell.cellType === "code"}
                <!-- Code cell -->
                <div class="flex">
                  <div class="flex-shrink-0 w-14 pt-3 text-right pr-2 font-mono text-xs text-surface-400 select-none">
                    [{cell.executionCount ?? " "}]:
                  </div>
                  <div class="flex-1 min-w-0 overflow-x-auto">
                    <div class="notebook-code-source">
                      {@html cell.sourceHtml ?? ""}
                    </div>
                    {#if cell.outputsHtml}
                      <div class="flex items-center border-t border-surface-200 dark:border-surface-700 px-3 py-1.5">
                        <button
                          class="run-button flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors
                            {revealedOutputs[i]
                              ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                              : 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 hover:bg-success-200 dark:hover:bg-success-800'}"
                          onclick={(e) => { e.stopPropagation(); toggleOutput(i); }}
                        >
                          <span class="text-sm">{revealedOutputs[i] ? "▾" : "▸"}</span>
                          {revealedOutputs[i] ? "Hide Output" : "Run"}
                        </button>
                      </div>
                      {#if revealedOutputs[i]}
                        <div class="notebook-outputs border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-3">
                          {@html cell.outputsHtml}
                        </div>
                      {/if}
                    {/if}
                  </div>
                </div>

              {:else if cell.cellType === "markdown"}
                <!-- Markdown cell -->
                <div class="p-4">
                  <article class="prose dark:prose-invert max-w-none">
                    {@html cell.sourceHtml ?? ""}
                  </article>
                </div>

              {:else}
                <!-- Raw cell -->
                <div class="p-4">
                  <pre class="text-sm font-mono whitespace-pre-wrap">{cell.source}</pre>
                </div>
              {/if}
            </div>
          {/each}
        {/key}
      </div>
    </div>
  </div>

  <!-- Mobile bottom navigation -->
  <div class="bg-primary-50 dark:bg-primary-900 fixed bottom-0 left-0 z-50 block w-full rounded-sm border lg:hidden">
    <nav class="flex items-center justify-between p-2">
      <button
        class="px-4 py-2 text-sm font-medium disabled:opacity-30"
        disabled={activeCellIndex === 0}
        onclick={() => { activeCellIndex--; scrollToCell(activeCellIndex); }}
      >
        &#9664; Prev
      </button>
      <span class="text-sm text-surface-500">
        {activeCellIndex + 1} / {cellCount}
      </span>
      <button
        class="px-4 py-2 text-sm font-medium disabled:opacity-30"
        disabled={activeCellIndex >= cellCount - 1}
        onclick={() => { activeCellIndex++; scrollToCell(activeCellIndex); }}
      >
        Next &#9654;
      </button>
    </nav>
  </div>
</div>

<style>
  :global(.notebook-code-source pre) {
    margin: 0 !important;
    border-radius: 0 !important;
  }

  :global(.notebook-outputs img) {
    max-width: 100%;
    height: auto;
  }

  :global(.notebook-outputs pre) {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    padding: 0.5rem;
    font-size: 0.85rem;
  }

  :global(.notebook-output-error) {
    color: #e74c3c;
    background: #fdf2f2;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.85rem;
    white-space: pre-wrap;
  }

  :global(.dark .notebook-output-error) {
    background: #2d1b1b;
    color: #ff6b6b;
  }

  :global(.notebook-output-stream) {
    font-family: monospace;
    font-size: 0.85rem;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  :global(.notebook-output-stream-stderr) {
    color: #e74c3c;
  }

  :global(.notebook-output-html) {
    overflow-x: auto;
  }

  :global(.notebook-output-html table) {
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  :global(.notebook-output-html table th),
  :global(.notebook-output-html table td) {
    border: 1px solid #ddd;
    padding: 0.3rem 0.6rem;
    text-align: left;
  }

  :global(.dark .notebook-output-html table th),
  :global(.dark .notebook-output-html table td) {
    border-color: #444;
  }
</style>
