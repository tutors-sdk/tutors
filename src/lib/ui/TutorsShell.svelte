<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import { onMount, type Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";
  import { animationDelay, hideMainNavigator } from "$lib/runes.svelte";
  import { cubicIn, cubicOut } from "svelte/easing";
  import { fly, slide } from "svelte/transition";

  type Props = { children: Snippet };
  let { children }: Props = $props();
  let showFooter = $state(false);

  onMount(() => {
    showFooter = true;
  });
</script>

<div class="flex h-screen flex-col">
  <header class="bg-surface-100 dark:bg-surface-950 sticky top-0 z-10">
    {#if !hideMainNavigator.value}
      <div
        class="w-full"
        in:fly={{ y: -48, duration: animationDelay.value * 2, easing: cubicOut }}
        out:fly={{ y: -48, duration: animationDelay.value * 2, easing: cubicIn }}
      >
        <MainNavigator />
      </div>
    {/if}
  </header>
  
  <main class="flex-1 overflow-y-auto">
    {@render children()}
  </main>

  {#if showFooter && !hideMainNavigator.value}
    <footer transition:slide={{ duration: 800 }} class="mt-auto hidden [@media(min-height:800px)]:lg:block">
      <Footer />
    </footer>
  {/if}
</div>

<style>
</style>
