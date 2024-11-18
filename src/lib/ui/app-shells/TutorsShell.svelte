<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";
  import Footer from "../navigators/footers/Footer.svelte";
  import HomeNavigator from "../navigators/HomeNavigator.svelte";

  interface Props {
    children?: import("svelte").Snippet;
  }
  let { children }: Props = $props();
</script>

<AppShell class="h-screen">
  {#snippet header()}
    <HomeNavigator />
  {/snippet}
  {@render children?.()}
  {#snippet pageFooter()}
    <Footer />
  {/snippet}
</AppShell>
