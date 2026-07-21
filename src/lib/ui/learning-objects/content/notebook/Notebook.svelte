<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import type { LiveNotebook } from "$lib/services/course";
  import { currentCodeTheme } from "$lib/services/markdown";
  import { sanitizeHtml } from "$lib/utils/sanitize";
  import { copyCode } from "$lib/services/markdown/actions/copy-code-action";
  import NotebookCell from "./cells/NotebookCell.svelte";
  import "./notebook-styles.css";

  interface Props {
    notebook: LiveNotebook;
  }
  let { notebook }: Props = $props();

  let loaded = false;
  let revealedOutputs = $state<Record<number, boolean>>({});
  let revealedSolutions = $state<Record<number, boolean>>({});

  function toggleOutput(index: number) {
    revealedOutputs[index] = !revealedOutputs[index];
  }

  function toggleSolution(index: number) {
    revealedSolutions[index] = !revealedSolutions[index];
  }

  function scrollToCell(index: number) {
    const el = document.getElementById(`notebook-cell-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleCellClick(index: number) {
    notebook.setActiveCell(index);
    scrollToCell(index);
  }

  function keypressInput(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = notebook.nextCell();
      if (nextIndex !== notebook.activeCellIndex) {
        notebook.setActiveCell(nextIndex);
        scrollToCell(nextIndex);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = notebook.prevCell();
      if (prevIndex !== notebook.activeCellIndex) {
        notebook.setActiveCell(prevIndex);
        scrollToCell(prevIndex);
      }
    }
  }

  // Event delegation for sidebar navigation
  function handleSidebarClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const button = target.closest("[data-cell-index]");
    if (button) {
      const index = parseInt(button.getAttribute("data-cell-index") ?? "0");
      handleCellClick(index);
    }
  }

  function handleSidebarKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSidebarClick(e as any);
    }
  }

  // Event delegation for mobile navigation
  function handleMobileNavClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const button = target.closest("[data-nav]");
    if (button) {
      const nav = button.getAttribute("data-nav");
      if (nav === "prev") {
        const prevIndex = notebook.prevCell();
        notebook.setActiveCell(prevIndex);
        scrollToCell(prevIndex);
      } else if (nav === "next") {
        const nextIndex = notebook.nextCell();
        notebook.setActiveCell(nextIndex);
        scrollToCell(nextIndex);
      }
    }
  }

  function handleMobileNavKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMobileNavClick(e as any);
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
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <nav class="nav-list" onclick={handleSidebarClick} onkeydown={handleSidebarKeydown}>
          <ul>
            {@html sanitizeHtml(notebook.navbarHtml ?? "")}
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content area -->
    <div class="min-h-screen flex-1 mr-4" use:copyCode>
      <div id="notebook-panel" class="mt-[-60px] block pt-[60px]">
        {#key currentCodeTheme.value}
          {#each notebook.cells as cell, i}
            <NotebookCell
              {cell}
              index={i}
              {notebook}
              isActive={notebook.activeCellIndex === i}
              outputRevealed={revealedOutputs[i] ?? false}
              solutionRevealed={revealedSolutions[i] ?? false}
              onToggleOutput={() => toggleOutput(i)}
              onToggleSolution={() => toggleSolution(i)}
              onClick={() => handleCellClick(i)}
              kernelLanguage={notebook.notebook.kernelLanguage}
            />
          {/each}
        {/key}
      </div>
    </div>
  </div>

  <!-- Mobile bottom navigation -->
  <div class="bg-primary-50 dark:bg-primary-900 fixed bottom-0 left-0 z-50 block w-full rounded-sm border lg:hidden">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <nav class="flex items-center justify-between p-2" onclick={handleMobileNavClick} onkeydown={handleMobileNavKeydown}>
      {@html sanitizeHtml(notebook.horizontalNavbarHtml ?? "")}
    </nav>
  </div>
</div>
