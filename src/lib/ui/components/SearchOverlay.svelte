<script lang="ts">
  import { goto } from "$app/navigation";
  import { searchService } from "$lib/services/search";
  import type { SearchResult } from "$lib/services/search";
  import { currentCourse, searchOpen } from "$lib/runes.svelte";
  import Icon from "./Icon.svelte";
  import { t } from "$lib/services/i18n";
  import { browser } from "$app/environment";

  let query = $state("");
  let results = $state<SearchResult[]>([]);
  let selectedIndex = $state(0);
  let inputElement: HTMLInputElement | undefined = $state();
  let debounceTimer: ReturnType<typeof setTimeout>;
  let resultsContainer: HTMLElement | undefined = $state();

  const isMac = browser && navigator.platform.toUpperCase().includes("MAC");

  function performSearch(value: string) {
    query = value;
    selectedIndex = 0;
    clearTimeout(debounceTimer);
    if (!value.trim()) {
      results = [];
      return;
    }
    debounceTimer = setTimeout(() => {
      const courseId = currentCourse.value?.courseId;
      if (courseId) {
        results = searchService.search(courseId, value).slice(0, 20);
      }
    }, 150);
  }

  function navigateToResult(result: SearchResult) {
    close();
    goto(result.lo.route);
  }

  function close() {
    searchOpen.value = false;
    query = "";
    results = [];
    selectedIndex = 0;
  }

  function scrollSelectedIntoView() {
    const item = resultsContainer?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
      scrollSelectedIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      scrollSelectedIntoView();
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function typeLabel(type: string): string {
    const labels: Record<string, string> = {
      lab: "Lab",
      step: "Step",
      note: "Note",
      panelnote: "Note",
      tutorial: "Tutorial",
      notebook: "Notebook",
      topic: "Topic"
    };
    return labels[type] ?? type;
  }

  $effect(() => {
    if (searchOpen.value && inputElement) {
      setTimeout(() => inputElement?.focus(), 50);
    }
  });
</script>

{#if searchOpen.value}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]" onkeydown={onKeydown}>
    <button class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick={close} aria-label={t("search.close")} tabindex="-1"></button>

    <div class="bg-surface-100 dark:bg-surface-900 relative z-10 mx-4 w-full max-w-xl overflow-hidden rounded-xl shadow-2xl" role="dialog" aria-modal="true" aria-label={t("nav.search.tip")}>
      <div class="flex items-center gap-3 border-b border-surface-300 dark:border-surface-700 px-4 py-3">
        <Icon type="search" />
        <input
          bind:this={inputElement}
          type="text"
          value={query}
          oninput={(e) => performSearch(e.currentTarget.value)}
          class="flex-1 bg-transparent text-base outline-none placeholder:text-surface-400"
          placeholder={t("search.placeholder")}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={results.length > 0 ? `search-result-${selectedIndex}` : undefined}
          autocomplete="off"
          spellcheck="false"
        />
        <kbd class="hidden rounded bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 text-xs font-mono text-surface-500 sm:inline">esc</kbd>
      </div>

      {#if results.length > 0}
        <ul id="search-results" class="max-h-80 overflow-y-auto p-2" role="listbox" bind:this={resultsContainer}>
          {#each results as result, i}
            <li
              id="search-result-{i}"
              role="option"
              aria-selected={i === selectedIndex}
              class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors {i === selectedIndex ? 'bg-surface-200 dark:bg-surface-700' : 'hover:bg-surface-200/50 dark:hover:bg-surface-700/50'}"
              onclick={() => navigateToResult(result)}
              onkeydown={(e) => e.key === "Enter" && navigateToResult(result)}
              onmouseenter={() => (selectedIndex = i)}
            >
              <div class="flex-shrink-0">
                <Icon type={result.lo.type === "step" ? "lab" : result.lo.type} height="18" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-medium">{result.lo.title}</div>
                {#if result.lo.parentLo?.title}
                  <div class="truncate text-xs text-surface-500">{result.lo.parentLo.title}</div>
                {/if}
              </div>
              <span class="flex-shrink-0 rounded bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 text-[10px] font-medium text-surface-500">
                {typeLabel(result.lo.type)}
              </span>
            </li>
          {/each}
        </ul>
      {:else if query.trim()}
        <div class="px-4 py-8 text-center text-sm text-surface-500">
          {t("search.noResults")}
        </div>
      {/if}

      <div class="flex items-center gap-4 border-t border-surface-300 dark:border-surface-700 px-4 py-2 text-[11px] text-surface-400">
        <span><kbd class="rounded bg-surface-200 dark:bg-surface-700 px-1 py-0.5 font-mono">↑↓</kbd> {t("search.navigate")}</span>
        <span><kbd class="rounded bg-surface-200 dark:bg-surface-700 px-1 py-0.5 font-mono">↵</kbd> {t("search.select")}</span>
        <span class="ml-auto"><kbd class="rounded bg-surface-200 dark:bg-surface-700 px-1 py-0.5 font-mono">{isMac ? "⌘" : "Ctrl"}+K</kbd> {t("search.shortcut")}</span>
      </div>
    </div>
  </div>
{/if}
