<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import { onMount, type Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";
  import { slide } from "svelte/transition";

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let showFooter = $state(false);

  onMount(() => {
    showFooter = true;
  });
</script>

<div class="flex h-screen flex-col">
  <header class="bg-surface-100 dark:bg-surface-950 sticky top-0 z-10">
    <MainNavigator />
  </header>
  <main class="flex-1 overflow-y-auto">
    {@render children()}
  </main>
  {#if showFooter}
    <footer transition:slide={{ duration: 800 }} class="mt-auto hidden [@media(min-height:800px)]:lg:block">
      <Footer />
    </footer>
  {/if}
</div>

<style>
</style>
