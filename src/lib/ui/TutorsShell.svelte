<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import { currentCourse, transitionKey } from "$lib/runes";
  import type { Snippet } from "svelte";
  import MainNavigator from "./navigators/MainNavigator.svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <header class="bg-surface-100 dark:bg-surface-950 ackdrop-blur-sm sticky top-0">
    <MainNavigator />
    {#if currentCourse?.value}
      <SecondaryNavigator />
    {/if}
  </header>
  <main class="mt-2 overflow-y-auto">
    {@render children()}
  </main>
  <footer class="hidden lg:block">
    <Footer />
  </footer>
</div>
