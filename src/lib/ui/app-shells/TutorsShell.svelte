<script lang="ts">
  import Footer from "../navigators/footers/Footer.svelte";
  import HomeNavigator from "../navigators/HomeNavigator.svelte";

  interface Props {
    children?: import("svelte").Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <header class="bg-surface-100 dark:bg-surface-950 sticky top-0 p-4 backdrop-blur-sm">
    <HomeNavigator />
  </header>
  <main class="overflow-y-auto">
    {@render children?.()}
  </main>
  <footer>
    <Footer />
  </footer>
</div>
