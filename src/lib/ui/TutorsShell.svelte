<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import { onMount, type Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";
  import { animationDelay, hideMainNavigator, shortcutsOverlayOpen } from "$lib/runes.svelte";
  import KeyboardShortcutsOverlay from "./components/KeyboardShortcutsOverlay.svelte";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly, slide } from "svelte/transition";
  import { prefersReducedMotion } from "$lib/services/a11y/reduced-motion.svelte";
  import { t } from "$lib/services/i18n";

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let showFooter = $state(false);

  onMount(() => {
    showFooter = true;
  });

  function handleGlobalKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) {
      return;
    }
    if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      shortcutsOverlayOpen.value = !shortcutsOverlayOpen.value;
    }
    if (e.key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      hideMainNavigator.value = !hideMainNavigator.value;
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div class="flex h-screen flex-col">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:p-4 focus:bg-primary-500 focus:text-white">
    {t("a11y.skipToContent")}
  </a>
  <header class="bg-surface-100 dark:bg-surface-950 sticky top-0 z-10">
    {#if !hideMainNavigator.value}
      <div
        class="w-full"
        in:fly={{ y: -48, duration: prefersReducedMotion.value ? 0 : animationDelay.value * 2, easing: cubicOut }}
        out:fly={{ y: -48, duration: prefersReducedMotion.value ? 0 : animationDelay.value * 2, easing: cubicIn }}
      >
        <MainNavigator />
      </div>
    {/if}
  </header>

  <main id="main-content" tabindex="-1" class="flex-1 overflow-y-auto outline-none">
    {@render children()}
  </main>

  {#if showFooter && !hideMainNavigator.value}
    <footer transition:slide={{ duration: prefersReducedMotion.value ? 0 : 800 }} class="mt-auto hidden [@media(min-height:800px)]:lg:block" aria-label={t("a11y.footer")}>
      <Footer />
    </footer>
  {/if}

  <KeyboardShortcutsOverlay />
</div>

<style>
</style>
