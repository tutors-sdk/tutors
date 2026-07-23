<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import { onMount, type Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";
  import { animationDelay, currentCourse, hideMainNavigator, searchOpen } from "$lib/runes.svelte";
  import SearchOverlay from "./components/SearchOverlay.svelte";
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
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (currentCourse.value && !currentCourse.value.isPortfolio) {
        searchOpen.value = !searchOpen.value;
      }
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
</div>

{#if currentCourse?.value && !currentCourse?.value?.isPortfolio}
  <SearchOverlay />
{/if}

<style>
</style>
