<script lang="ts">
  import Footer from "$lib/ui/navigators/footers/Footer.svelte";
  import SecondaryNavigator from "$lib/ui/navigators/SecondaryNavigator.svelte";
  import { transitionKey } from "$lib/runes";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";
  import MainNavigator from "../navigators/MainNavigator.svelte";

  type Props = { children: Snippet };
  let { children }: Props = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <header class="bg-surface-100 dark:bg-surface-950 sticky top-0 backdrop-blur-sm">
    <MainNavigator />
    <SecondaryNavigator />
  </header>
  <main class="overflow-y-auto">
    {#key transitionKey.value}
      <div id="app" class="h-full">
        <div id="top"></div>
        <div class="mx-auto my-4">
          <div in:fade={{ duration: 300, delay: 200 }}>
            {@render children()}
          </div>
        </div>
      </div>
    {/key}
  </main>
  <footer>
    <Footer />
  </footer>
</div>
