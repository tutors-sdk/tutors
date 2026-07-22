<script lang="ts">
  import { shortcutsOverlayOpen, currentLo } from "$lib/runes.svelte";
  import { t } from "$lib/services/i18n";
  import { getActiveCategories } from "$lib/services/a11y/keyboard-shortcuts";
  import { prefersReducedMotion } from "$lib/services/a11y/reduced-motion.svelte";
  import Icon from "./Icon.svelte";

  let dialogEl: HTMLDialogElement | undefined = $state();

  const categories = $derived(getActiveCategories(currentLo.value?.type));

  $effect(() => {
    if (!dialogEl) return;
    if (shortcutsOverlayOpen.value) {
      dialogEl.showModal();
    } else {
      dialogEl.close();
    }
  });

  function onClose() {
    shortcutsOverlayOpen.value = false;
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) {
      onClose();
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  class="m-auto max-w-lg w-full rounded-xl bg-surface-50 dark:bg-surface-900 shadow-2xl
    backdrop:bg-black/50 backdrop:backdrop-blur-sm
    open:animate-in open:fade-in open:zoom-in-95
    {prefersReducedMotion.value ? 'open:duration-0' : 'open:duration-200'}
    p-0 border border-surface-200 dark:border-surface-700"
  aria-labelledby="shortcuts-title"
  onclick={onBackdropClick}
  onclose={onClose}
>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 id="shortcuts-title" class="text-xl font-bold">{t("shortcuts.title")}</h2>
      <button class="btn-icon preset-tonal" onclick={onClose} aria-label={t("shortcuts.close")}>
        <Icon type="close" />
      </button>
    </div>

    {#each categories as category, i}
      {#if i > 0}
        <hr class="my-4 border-surface-200 dark:border-surface-700" />
      {/if}
      <h3 class="text-sm font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400 mb-3">
        {t(category.titleKey)}
      </h3>
      <div class="space-y-2">
        {#each category.shortcuts as shortcut}
          <div class="flex items-center justify-between py-1">
            <span class="text-sm">{t(shortcut.descriptionKey)}</span>
            <div class="flex items-center gap-1">
              {#each shortcut.keys as key, k}
                {#if k > 0}
                  <span class="text-xs text-surface-400">/</span>
                {/if}
                <kbd class="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-1
                  text-xs font-mono font-semibold
                  bg-surface-200 dark:bg-surface-700
                  border border-surface-300 dark:border-surface-600
                  rounded-md shadow-sm">{key}</kbd>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/each}

    <div class="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
      <p class="text-xs text-center text-surface-400">
        {t("shortcuts.showShortcuts")}: <kbd class="inline-flex items-center justify-center min-w-[1.25rem] px-1.5 py-0.5
          text-xs font-mono font-semibold
          bg-surface-200 dark:bg-surface-700
          border border-surface-300 dark:border-surface-600
          rounded shadow-sm">?</kbd>
      </p>
    </div>
  </div>
</dialog>
