<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import { currentCourse, transitionKey } from "$lib/runes";
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

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <header class="sticky top-0 bg-surface-100 dark:bg-surface-950">
    <MainNavigator />
    {#if currentCourse?.value}
      <SecondaryNavigator />
    {/if}
  </header>
  <main class="mt-2 overflow-y-auto">
    {@render children()}
  </main>
  {#if showFooter}
    <footer transition:slide={{ duration: 800 }} class="hidden lg:block">
      <Footer />
    </footer>
  {/if}
</div>
