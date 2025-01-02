<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import { onMount, type Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";
  import { slide } from "svelte/transition";
  import { currentCourse } from "$lib/runes";

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let showFooter = $state(false);

  onMount(() => {
    showFooter = true;
  });
</script>

<div class="flex h-screen flex-col">
  <header class="sticky top-0 z-10 bg-surface-100 dark:bg-surface-950">
    <MainNavigator />
    {#if currentCourse.value}
      <SecondaryNavigator />
    {/if}
  </header>
  <main class="mt-2 flex-1 overflow-y-auto">
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
